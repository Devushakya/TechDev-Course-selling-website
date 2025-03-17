import React from "react";
import * as Icon1 from "react-icons/bi";
import * as Icon3 from "react-icons/hi2";
import * as Icon2 from "react-icons/io5";
import Footer from "../components/common/Footer";
import ContactForm from "../components/core/contactPage/ContactForm";


const Contact = () => {

 const contactDetails = [
   {
     icon: "HiChatBubbleLeftRight",
     heading: "Chat on us",
     description: "Our friendly team is here to help.",
     details: "deveshsh.iitism@gmail.com",
   },
   {
     icon: "BiWorld",
     heading: "Visit us",
     description: "Come and say hello to me 😊.",
     details: "IIT ISM Dhanbad ,Jharkhand",
   },
   {
     icon: "IoCall",
     heading: "Call Us",
     details: "+91 9876543210",
   },
 ];

  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6">
                {contactDetails.map((ele, i) => {
                  let Icon = Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon]
                  return (
                    <div
                      className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200"
                      key={i}
                    >
                      <div className="flex flex-row items-center gap-3">
                        <Icon size={25} />
                        <h1 className="text-lg font-semibold text-richblack-5">
                          {ele?.heading}
                        </h1>
                      </div>
                      <p className="font-medium">{ele?.description}</p>
                      <p className="font-semibold">{ele?.details}</p>
                    </div>
                  )
                })}
              </div>
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
