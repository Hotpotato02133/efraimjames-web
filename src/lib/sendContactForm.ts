export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  project: string;
}

// Web3Forms: the access key is public by design; the destination email is tied to it on their side.
export const sendContactForm = async (
  formData: ContactFormData,
  botcheck: boolean
) => {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
      subject: `New portfolio inquiry from ${formData.firstName} ${formData.lastName}`,
      from_name: "Portfolio Contact Form",
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone ? `+63 ${formData.phone}` : "Not provided",
      message: formData.project,
      botcheck,
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to send message");
  }
};
