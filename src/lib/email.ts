import emailjs from "@emailjs/browser";

export async function sendEmail(templateParams: Record<string, string>) {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );
    return response;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}
