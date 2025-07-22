import React from 'react';
import Icon from './Icon';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Icon name="hospital" className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">DigitalClinic</h3>
                <p className="text-gray-400 text-sm">Healthcare Made Simple</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Connecting patients with healthcare providers through innovative digital solutions. 
              Book appointments, manage your health records, and access quality healthcare services online.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Icon name="facebook" className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Icon name="twitter" className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Icon name="linkedin" className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Icon name="instagram" className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/doctors" className="text-gray-400 hover:text-white transition-colors">
                  Find Doctors
                </a>
              </li>
              <li>
                <a href="/clinics" className="text-gray-400 hover:text-white transition-colors">
                  Clinics
                </a>
              </li>
              <li>
                <a href="/book-appointment" className="text-gray-400 hover:text-white transition-colors">
                  Book Appointment
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>
                © {currentYear} DigitalClinic. All rights reserved. | 
                Founder: <span className="text-white font-medium">Sasank Kolluru</span>
              </p>
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <Icon name="heart" className="text-red-500 mr-1" />
              <span>Made with care for better healthcare</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
