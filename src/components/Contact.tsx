import React, { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    project: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Initialize EmailJS
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Send email using EmailJS - now using the same template as ContactPage
      const result = await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",
        import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || "template_orw5xze",
        formRef.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY"
      );

      console.log("Email sent successfully:", result.text);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          project: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "efraimjamestalucod88@gmail.com",
      href: "mailto:efraimjamestalucod88@gmail.com",
    },
    {
      icon: Phone,
      title: "WhatsApp",
      value: "(+63) 965 639 4996",
      href: "https://wa.me/639656394996?text=Hello%20Efraim,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Zamboanga City, Philippines",
      href: "https://maps.google.com/?q=Zamboanga+City,+Philippines",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-16 sm:py-20 relative bg-gray-50"
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent px-2">
            Get In Touch
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Ready to bring your vision to life? Let's discuss your project and
            create something amazing together. I'm always excited to tackle new
            challenges and collaborate with creative minds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div
            className={`transition-all duration-1000 delay-200 px-2 sm:px-0 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 lg:p-6 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg hover:shadow-green-100 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                      {info.title}
                    </h3>
                    <a
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-gray-600 hover:text-green-600 transition-colors duration-300 break-words"
                    >
                      {info.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 delay-400 px-2 sm:px-0 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8"
            >
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    placeholder="John"
                  />
                  <input
                    type="hidden"
                    name="first_name"
                    value={formData.firstName}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    placeholder="Doe"
                  />
                  <input
                    type="hidden"
                    name="last_name"
                    value={formData.lastName}
                  />
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  placeholder="john@example.com"
                />
                <input type="hidden" name="user_email" value={formData.email} />
              </div>

              <div className="mb-4 sm:mb-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <div className="flex">
                  <div className="flex items-center px-2 sm:px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                    <span className="text-xs sm:text-sm text-gray-600">
                      🇵🇭 +63
                    </span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(965) 639-4996"
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-r-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  />
                </div>
                <input type="hidden" name="user_phone" value={formData.phone} />
              </div>

              <div className="mb-4 sm:mb-6">
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  What kind of project do you have in mind?
                </label>
                <textarea
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
                  placeholder="Tell me about your project..."
                ></textarea>
                <input
                  type="hidden"
                  name="project_details"
                  value={formData.project}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitted || isLoading}
                className={`w-full py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                  isSubmitted
                    ? "bg-green-600 text-white"
                    : isLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25"
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Message Sent!</span>
                  </>
                ) : isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;