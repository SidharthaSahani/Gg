import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AboutUs() {
  const navigate = useNavigate();

  const scrollToFooter = () => {
    const footerElement = document.getElementById('contact-footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex-grow w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">About Grills & Gather</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our story, mission, and commitment to providing exceptional dining experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Grills & Gather was founded with a simple vision: to create a place where friends and family 
              could come together to enjoy exceptional food in a warm, welcoming atmosphere. What started as 
              a small family venture has grown into a beloved dining destination known for our commitment 
              to quality and hospitality.
            </p>
            <p className="text-gray-600">
              Our journey began over a decade ago when our founders recognized the need for a restaurant 
              that truly brings people together. Today, we continue to honor that vision by sourcing the 
              finest ingredients, crafting innovative dishes, and providing outstanding service.
            </p>
          </div>
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80 sm:h-96 flex items-center justify-center">
                      <span className="text-gray-500">Restaurant Image</span>
                      <img src="" alt="" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To create memorable dining experiences that bring people together through exceptional food, 
              warm hospitality, and a welcoming atmosphere.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Our Vision</h3>
            <p className="text-gray-600">
              To be the premier destination for those seeking quality cuisine and genuine connection, 
              fostering community one meal at a time.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Our Values</h3>
            <p className="text-gray-600">
              Quality, authenticity, community, and sustainability guide everything we do, from sourcing 
              ingredients to serving our guests.
            </p>
          </div>
        </div>

    

        <div className="text-center">
          

        </div>
        
        <div className="text-center mb-12">
          <p className="text-gray-600 mb-4">
            Ready to experience our delicious food? <a href="/" className="text-blue-600 hover:underline">Book your table now</a> for an unforgettable dining experience.
          </p>
          <p className="text-gray-600">
            Visit our <a href="/" className="text-blue-600 hover:underline">home page</a> to make a reservation or learn more about our menu.
          </p>
        </div>
      </main>
      
      <footer id="contact-footer" className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Grills & Gather</h3>
              <p className="text-gray-300">Experience the finest dining with our delicious food and excellent service.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-white transition">Home</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white transition">About Us</a></li>
                <li><a 
                  href="#contact-footer" 
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToFooter();
                  }}
                  className="text-gray-300 hover:text-white transition"
                >
                  Contact
                </a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-300">
                <li>📞 9840923097 </li>
                <li>📞 9848675285 </li>
                <li>✉️ info@grillandgathering.com</li>
                <li>📍 Grills & Gather ,Balkot </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-bold mb-4">Find Us</h3>
            <div className="rounded-lg overflow-hidden border border-gray-300">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d403.7530625579317!2d85.3660333256802!3d27.664689598970888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b093dec14f3%3A0x90b02fb7b0713ace!2sGrills%20and%20Gather!5e1!3m2!1sen!2snp!4v1766763639443!5m2!1sen!2snp" 
                width="100%" 
                height="300" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Grills & Gather Location Map"
              />
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Grills & Gather. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}