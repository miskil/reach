// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail(
  email: string,
  token: string,
  siteId: string
) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up?inviteId=${token}`;
  console.log("inviteUrl", inviteUrl);
  console.log("email", email);
  console.log("siteId", siteId);
  console.log("token", token);
  await resend.emails.send({
    from: "noreply@yourdomain.com",
    to: email,
    subject: "You're invited!",
    html: `<p>You have been invited to join the site ${siteId}.</p><p><a href="${inviteUrl}">Click here to accept your invite</a></p>`,
  });
}
