import React from "react";

export default function Menu() {
  return (
    <div className="bg-black text-white min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        {/* Decorative Header */}
        <div className="flex justify-center mb-6">
          <div className="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-10">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-40">
                <img
                  src="https://media.istockphoto.com/id/618764348/photo/famous-asian-flat-bread-known-as-parathas.jpg?s=612x612&w=0&k=20&c=yrz3Gn1RIHw8ohxG0uGNAU1H8wa2dB6xRli_DD3PJ6o="
                  alt="पराठे"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="bg-yellow-500 text-black font-bold px-6 py-2 inline-block ml-4 mb-4 rounded-tr-lg rounded-bl-lg">
                    पराठे
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <MenuItem name="आलू पराठा" price="40" />
                <MenuItem name="पनीर पराठा" price="60" />
                <MenuItem name="गोभी पराठा" price="40" />
                <MenuItem name="प्याज पराठा" price="40" />
                <MenuItem name="मिक्स पराठा" price="50" />
                <MenuItem name="मेथी पराठा" price="40" />
                <MenuItem name="अचारी पराठा" price="40" />
              </div>
            </div>

            {/* Puri Section */}
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-40">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrgEo7ID_gcMgSDS2ELpo_KzCCW47-tnRzrA&s"
                  alt="पूरी"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="bg-yellow-500 text-black font-bold px-6 py-2 inline-block ml-4 mb-4 rounded-tr-lg rounded-bl-lg">
                    पूरी
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <MenuItem name="पूरी सब्जी (2 पूरी)" price="40" />
                <MenuItem name="पूरी सब्जी (4 पूरी)" price="70" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-10">
            {/* Thali Section */}
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-40">
                <img
                  src="https://media.istockphoto.com/id/1158578874/photo/indian-hindu-veg-thali-food-platter-selective-focus.jpg?s=612x612&w=0&k=20&c=ZHAsJ9sJJoeAmwD3iU1Oo2YSKn_BG6JoE7zuG1frxwg="
                  alt="थाली"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="bg-yellow-500 text-black font-bold px-6 py-2 inline-block ml-4 mb-4 rounded-tr-lg rounded-bl-lg">
                    थाली
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <MenuItem name="साधारण थाली" price="70" />
                <MenuItem name="स्पेशल थाली" price="90" />
                <MenuItem name="राजस्थानी थाली" price="100" />
                <MenuItem name="दाल राइस" price="60" />
                <MenuItem name="चावल सब्जी" price="60/70" />
                <MenuItem name="मिक्स राइस" price="60/110" />
              </div>
            </div>

            {/* Roti Section */}
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-40">
                <img
                  src="https://t3.ftcdn.net/jpg/04/02/96/42/360_F_402964244_CaWXa99d6DZ5b1zRjlsdX5gXtpcZqGWs.jpg"
                  alt="रोटी"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="bg-yellow-500 text-black font-bold px-6 py-2 inline-block ml-4 mb-4 rounded-tr-lg rounded-bl-lg">
                    रोटी
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <MenuItem name="तंदूरी रोटी" price="10" />
                <MenuItem name="बटर रोटी" price="15" />
                <MenuItem name="मिस्सी रोटी" price="20" />
              </div>
            </div>

            {/* Cold Drinks Section */}
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-40">
                <img
                  src="https://i.pinimg.com/736x/45/7e/e1/457ee121f4f4a338a78fb734fd03fa76.jpg"
                  alt="शीतल पेय"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="bg-yellow-500 text-black font-bold px-6 py-2 inline-block ml-4 mb-4 rounded-tr-lg rounded-bl-lg">
                    शीतल पेय
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <MenuItem name="पानी बोतल" price="20" />
                <MenuItem name="कोल्ड ड्रिंक" price="20" />
                <MenuItem name="लस्सी" price="40" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="flex justify-center mt-12 mb-6">
          <div className="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ name, price }) {
  return (
    <div className="flex justify-between border-b border-gray-800 py-2 last:border-0">
      <span className="text-lg">{name}</span>
      <span className="font-semibold text-yellow-500">₹{price}</span>
    </div>
  );
}
