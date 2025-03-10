import image from "../assets/main.jpg";
import HomeButton from "./HomeButton";
export default function ContactUs() {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-secondary to-black p-6">
      {/* Contact Box */}
      <div className="bg-gray-600 shadow-xl rounded-2xl p-10 max-w-3xl w-full">
        {/* Attention-Grabbing Heading */}
        <h2 className="text-4xl font-extrabold text-center text-white bg-clip-text bg-gradient-to-r from-accent to-white mb-6">
          Let's Connect – We're Here to Help!
        </h2>

        {/* Two Sections: Call Us & Email Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Call Us Section */}
          {/* <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-phone-alt text-accent"></i> Call Us
            </h3>
            <p className="text-gray-400 mt-2">
              Need instant help? Call us now.
            </p>
            <p className="text-lg text-white mt-3 font-semibold">
              📞 +91 98765 43210
            </p>
          </div> */}

          {/* Email Support Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-envelope text-accent"></i> Email Support
            </h3>
            <p className="text-gray-400 mt-2">
              Prefer writing? Drop us an email.
            </p>
            <p className="text-xl text-white mt-3 font-semibold">
              📧 info@merishiksha.com
            </p>
          </div>
        </div>
        <div className="md:w-1/2  flex justify-center mt-8 md:mt-0">
          <img src={image} className="rounded-lg shadow-lg w-80 md:w-96" />
        </div>
      </div>
      <HomeButton></HomeButton>
    </div>
  );
}
