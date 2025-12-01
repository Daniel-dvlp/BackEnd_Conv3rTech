const nodemailer = require("nodemailer");

function createTransport() {
  const provider = String(process.env.SMTP_PROVIDER || "").toLowerCase();
  const isDev = (process.env.NODE_ENV || "development") !== "production";
  const enableDebug = String(process.env.SMTP_DEBUG || "false").toLowerCase() === "true";

  // Opciones comunes para mejorar resiliencia del SMTP
  // Evita colisión de identificadores en entornos de build distintos
  const smtpPool = String(process.env.SMTP_POOL || "true").toLowerCase() === "true";
  const smtpMaxConnections = Number(process.env.SMTP_MAX_CONNECTIONS || 1);
  const smtpConnectionTimeout = Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000); // 10s
  const smtpGreetingTimeout = Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000); // 10s
  const smtpSocketTimeout = Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 20000); // 20s
  const smtpTlsRejectUnauthorized = String(process.env.SMTP_TLS_REJECT_UNAUTHORIZED || "true").toLowerCase() === "true";


  // OAuth2 (Gmail) soporte directo
  const authType = String(process.env.SMTP_AUTH_TYPE || "").toLowerCase();
  if ((provider === "gmail" || provider === "google") && authType === "oauth2") {
    const user = process.env.SMTP_USER;
    const clientId = process.env.GMAIL_CLIENT_ID || process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET || process.env.OAUTH_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN || process.env.OAUTH_REFRESH_TOKEN;
    if (user && clientId && clientSecret && refreshToken) {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user,
          clientId,
          clientSecret,
          refreshToken,
        },
        pool: smtpPool,
        maxConnections: smtpMaxConnections,
        connectionTimeout: smtpConnectionTimeout,
        greetingTimeout: smtpGreetingTimeout,
        socketTimeout: smtpSocketTimeout,
        logger: enableDebug,
        debug: enableDebug,
        tls: { rejectUnauthorized: smtpTlsRejectUnauthorized },
      });
    }
  }

  // Soporte directo: Brevo (Sendinblue)
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (provider === "brevo" && brevoApiKey) {
    return nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: { user: "apikey", pass: brevoApiKey },
      pool: smtpPool,
      maxConnections: smtpMaxConnections,
      connectionTimeout: smtpConnectionTimeout,
      greetingTimeout: smtpGreetingTimeout,
      socketTimeout: smtpSocketTimeout,
      logger: enableDebug,
      debug: enableDebug,
      tls: { rejectUnauthorized: smtpTlsRejectUnauthorized },
    });
  }

  // Soporte directo: SendGrid
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  if (provider === "sendgrid" && sendgridApiKey) {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: { user: "apikey", pass: sendgridApiKey },
      pool: smtpPool,
      maxConnections: smtpMaxConnections,
      connectionTimeout: smtpConnectionTimeout,
      greetingTimeout: smtpGreetingTimeout,
      socketTimeout: smtpSocketTimeout,
      logger: enableDebug,
      debug: enableDebug,
      tls: { rejectUnauthorized: smtpTlsRejectUnauthorized },
    });
  }

  // Proveedor genérico usando variables SMTP_*
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true"; // true para 465
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    if (enableDebug) {
      console.info("[MailService] SMTP genérico configurado", { host, port, secure, user: user && user.slice(0, 2) + "***" });
    }
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      pool: smtpPool,
      maxConnections: smtpMaxConnections,
      connectionTimeout: smtpConnectionTimeout,
      greetingTimeout: smtpGreetingTimeout,
      socketTimeout: smtpSocketTimeout,
      logger: enableDebug,
      debug: enableDebug,
      tls: { rejectUnauthorized: smtpTlsRejectUnauthorized },
    });
  }

  // Fallback automático de desarrollo (no envía correo real)
  if (isDev || String(process.env.SMTP_DEV_MODE || "false").toLowerCase() === "true") {
    if (enableDebug) {
      console.info("[MailService] Modo DEV activo: jsonTransport, no se envía correo real");
    }
    return nodemailer.createTransport({ jsonTransport: true });
  }
  throw new Error("SMTP no configurado: define SMTP_PROVIDER y su API KEY, o SMTP_HOST/USER/PASS en .env");
}

function buildPasswordRecoveryEmail({ name = "Usuario", code, expiresMinutes = 15 }) {
  const brand = "Conv3rTech";
  const supportUrl = process.env.APP_SUPPORT_URL || "https://conv3rtech.com/support";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${brand} • Recuperación de contraseña</title>
      <style>
        body { background: #f5f7fb; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif; color: #1f2937; }
        .container { max-width: 560px; margin: 0 auto; padding: 24px; }
        .card { background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(17,24,39,0.08); overflow: hidden; }
        .header { background: linear-gradient(135deg, #f59e0b, #eab308); padding: 28px 28px; color: #111827; }
        .brand { font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
        .title { font-size: 18px; font-weight: 700; margin: 8px 0 0; }
        .content { padding: 28px; }
        .greeting { font-size: 16px; margin: 0 0 16px; }
        .lead { font-size: 15px; line-height: 1.6; margin: 0 0 16px; color: #374151; }
        /* Nota: muchos clientes de correo limitan CSS. La maquetación del código
           usa tabla con estilos en línea para garantizar centrado vertical/horizontal
           en Gmail/Outlook. Estas clases quedan como fallback en clientes modernos. */
        .code-wrap { margin: 24px 0; text-align: center; }
        .code-box { display: inline-block; width: 42px; height: 52px; line-height: 52px; text-align: center; vertical-align: middle; border-radius: 12px; background: #111827; color: #fef3c7; font-weight: 800; font-size: 22px; box-shadow: inset 0 0 10px rgba(234,179,8,0.25), 0 6px 12px rgba(17,24,39,0.15); }
        .cta { display: block; text-align: center; margin: 18px auto 8px; padding: 12px 18px; background: linear-gradient(135deg, #f59e0b, #eab308); color: #111827; font-weight: 800; border-radius: 12px; text-decoration: none; }
        .note { font-size: 13px; color: #6b7280; text-align: center; margin: 8px 0 0; }
        .list { margin: 18px 0; padding-left: 18px; color: #374151; }
        .list li { margin: 8px 0; }
        .footer { padding: 18px 28px 26px; text-align: center; font-size: 12px; color: #6b7280; }
        .divider { height: 1px; background: #f3f4f6; margin: 8px 28px; }
        a { color: #b45309; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="brand">${brand}</div>
            <div class="title">Recuperación de contraseña</div>
          </div>
          <div class="content">
            <p class="greeting">Hola ${name},</p>
            <p class="lead">Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente código para continuar:</p>
            <div class="code-wrap">
              <table role="presentation" align="center" cellpadding="0" cellspacing="8" style="margin:24px auto; border-collapse: separate;">
                <tr>
                  ${String(code)
                    .split("")
                    .map(
                      (d) =>
                        `<td style="width:42px;height:52px;line-height:52px;text-align:center;vertical-align:middle;background:#111827;color:#fef3c7;font-weight:800;font-size:22px;border-radius:12px;box-shadow:inset 0 0 10px rgba(234,179,8,0.25), 0 6px 12px rgba(17,24,39,0.15); mso-line-height-rule:exactly;">${d}</td>`
                    )
                    .join("")}
                </tr>
              </table>
            </div>
            <a class="cta" href="#" aria-disabled="true">Ingresar código en Conv3rTech</a>
            <p class="note">Este código expira en ${expiresMinutes} minutos.</p>
            <ul class="list">
              <li>No compartas este código con nadie.</li>
              <li>Si no fuiste tú, puedes ignorar este correo. Tu cuenta permanecerá segura.</li>
              <li>Para ayuda adicional, visita nuestro <a href="${supportUrl}">Centro de soporte</a>.</li>
            </ul>
          </div>
          <div class="divider"></div>
          <div class="footer">
            © ${year} ${brand}. Todos los derechos reservados.<br/>
            Este mensaje fue enviado automáticamente. No respondas a este correo.
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

function buildPasswordRecoveryText({ name = "Usuario", code, expiresMinutes = 15 }) {
  const brand = "Conv3rTech";
  const supportUrl = process.env.APP_SUPPORT_URL || "https://conv3rtech.com/support";
  return [
    `${brand} • Recuperación de contraseña`,
    `Hola ${name},`,
    `Tu código de recuperación es: ${code}`,
    `Este código expira en ${expiresMinutes} minutos.`,
    `Recomendaciones:`,
    `- No compartas este código.`,
    `- Si no fuiste tú, ignora este mensaje.`,
    `- Ayuda: ${supportUrl}`,
  ].join("\n");
}

async function sendPasswordRecoveryCode(to, code) {
  const from = process.env.SMTP_FROM || "no-reply@conv3rtech.com";
  const transport = createTransport();

  const subject = "Recupera tu contraseña — Conv3rTech";
  const name = arguments[2] || undefined; // compat: permitir tercer argumento opcional
  const expiresMinutes = Number(process.env.RECOVERY_CODE_EXPIRES_MINUTES || 15);
  const text = buildPasswordRecoveryText({ name, code, expiresMinutes });
  const html = buildPasswordRecoveryEmail({ name, code, expiresMinutes });

  const info = await transport.sendMail({ from, to, subject, text, html });

  // En modo dev (jsonTransport), mostrar el código claramente en consola
  if (transport.options && (transport.options.jsonTransport || transport.options.streamTransport)) {
    console.info("[DEV][MailService] Simulando envío de correo de recuperación:");
    console.info({ to, subject, name, code });
    // Para facilitar pruebas manuales sin SMTP
    if (String(process.env.SMTP_DEV_ECHO_CODE || "false").toLowerCase() === "true") {
      console.info("[DEV][MailService] Código de recuperación:", code);
    }
  }

  return info;
}

async function verifyTransport() {
  const transport = createTransport();
  const info = {
    provider: String(process.env.SMTP_PROVIDER || "").toLowerCase(),
    host: transport.options?.host,
    port: transport.options?.port,
    secure: transport.options?.secure,
    pool: transport.options?.pool,
    logger: transport.options?.logger,
    debug: transport.options?.debug,
  };
  try {
    await transport.verify();
    info.verified = true;
    info.message = "SMTP verificado correctamente";
  } catch (err) {
    info.verified = false;
    info.error = err.message;
  }
  return info;
}

async function sendGenericEmail({ to, subject, text, html, from }) {
  const transport = createTransport();
  const sender = from || process.env.SMTP_FROM || "no-reply@conv3rtech.com";
  const payload = {
    from: sender,
    to,
    subject: subject || "Prueba SMTP Conv3rTech",
    text: text || "Este es un correo de prueba de Conv3rTech",
    html,
  };
  const info = await transport.sendMail(payload);
  return info;
}

async function verifyTransport() {
  const transport = createTransport();
  const info = {
    provider: String(process.env.SMTP_PROVIDER || "").toLowerCase(),
    host: transport.options?.host,
    port: transport.options?.port,
    secure: transport.options?.secure,
    pool: transport.options?.pool,
    logger: transport.options?.logger,
    debug: transport.options?.debug,
  };
  try {
    await transport.verify();
    info.verified = true;
    info.message = "SMTP verificado correctamente";
  } catch (err) {
    info.verified = false;
    info.error = err.message;
  }
  return info;
}

async function sendGenericEmail({ to, subject, text, html, from }) {
  const transport = createTransport();
  const sender = from || process.env.SMTP_FROM || "no-reply@conv3rtech.com";
  const payload = {
    from: sender,
    to,
    subject: subject || "Prueba SMTP Conv3rTech",
    text: text || "Este es un correo de prueba de Conv3rTech",
    html,
  };
  const info = await transport.sendMail(payload);
  return info;
}

module.exports = {
  sendPasswordRecoveryCode,
  verifyTransport,
  sendGenericEmail,
  verifyTransport,
  sendGenericEmail,
};