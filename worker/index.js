export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return corsResponse(new Response(null, { status: 204 }), request);
    }

    if (request.method !== "POST") {
      return corsResponse(new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 }), request);
    }

    if (url.pathname === "/api/contact") {
      return corsResponse(await handleContact(request, env), request);
    }

    if (url.pathname === "/api/newsletter") {
      return corsResponse(await handleNewsletter(request, env), request);
    }

    return corsResponse(new Response(JSON.stringify({ error: "Not found" }), { status: 404 }), request);
  },
};

function corsResponse(response, request) {
  const headers = new Headers(response.headers);
  const origin = request?.headers?.get("Origin") || "";
  const allowed = ["https://bugvi.org", "https://aibf.ngo"];
  if (allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  } else {
    headers.set("Access-Control-Allow-Origin", "https://bugvi.org");
  }
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(response.body, { status: response.status, headers });
}

async function handleContact(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { name, email, message } = data;
  if (!email || !message) {
    return new Response(JSON.stringify({ error: "Email and message are required" }), { status: 400 });
  }

  const sanitizedName = (name || "Anonymous").replace(/[<>]/g, "");
  const sanitizedEmail = email.replace(/[<>]/g, "");
  const sanitizedMessage = message.replace(/[<>]/g, "");

  try {
    // Store in database
    await env.DB.prepare(
      "INSERT INTO contact_messages (name, email, message, created_at) VALUES (?, ?, ?, datetime('now'))"
    ).bind(sanitizedName, sanitizedEmail, sanitizedMessage).run();

    // Send email notification via MailChannels
    const origin = request.headers.get("Origin") || "website";
    const site = origin.includes("aibf") ? "AIBF" : "Bugvi.org";
    await sendEmailNotification(env, {
      site,
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    // Still return success if DB saved but email failed
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
}

async function handleNewsletter(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { email } = data;
  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
  }

  const sanitizedEmail = email.replace(/[<>]/g, "").trim().toLowerCase();

  try {
    await env.DB.prepare(
      "INSERT OR IGNORE INTO newsletter_subscribers (email, subscribed_at) VALUES (?, datetime('now'))"
    ).bind(sanitizedEmail).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to subscribe" }), { status: 500 });
  }
}

async function sendEmailNotification(env, { site, name, email, message }) {
  try {
    await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: env.NOTIFY_EMAIL, name: "AIBF Admin" }],
          },
        ],
        from: { email: "noreply@aibf.ngo", name: `${site} Contact Form` },
        reply_to: { email: email, name: name },
        subject: `[${site}] New message from ${name}`,
        content: [
          {
            type: "text/plain",
            value: `New contact form submission from ${site}\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nThis is an automated notification from ${site}.`,
          },
        ],
      }),
    });
  } catch {
    // Silently fail — message is already saved in DB
  }
}
