'use client'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { IoMdSend, IoMdRocket } from 'react-icons/io'
import { FaCode, FaUsers, FaShieldAlt, FaLightbulb } from 'react-icons/fa'
import { MdSpeed, MdSecurity } from 'react-icons/md'

function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 -z-10">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 20%, transparent 80%)'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="w-full container max-w-[1580px] h-auto mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section - About Lokalhost.io */}
        <div className="mb-20">
          <div className="border border-dashed p-8 md:p-12 lg:p-16">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <span className="px-4 py-2 bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 text-xs font-sans font-semibold rounded-full border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800">
                  About Us
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold font-sans"
              >
                Welcome to Lokalhost.io
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-sans font-medium"
              >
                Revolutionizing Local Development for Modern Developers
              </motion.p>

              {/* Long Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm md:text-base leading-relaxed space-y-4 text-left md:text-center"
              >
                <p>
                  Lokalhost.io is more than just a development tool—it's a complete ecosystem designed to transform the way developers build, test, and deploy applications locally. We understand the challenges developers face when setting up local environments, managing dependencies, and collaborating with teams across different platforms.
                </p>
                <p>
                  Our mission is to eliminate the complexity of local development by providing a seamless, intuitive platform that works right out of the box. Whether you're a solo developer working on a side project or part of a large enterprise team, Lokalhost.io adapts to your workflow, not the other way around.
                </p>
                <p>
                  With cutting-edge technology, robust security features, and a commitment to developer experience, we're building the future of local development. Join thousands of developers who have already made the switch and discovered a better way to build software.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 pt-6"
              >
                <motion.button
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  whileHover={{ y: -3 }}
                  whileTap={{ y: -4 }}
                  className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-50 dark:border-neutral-400 relative overflow-hidden cursor-pointer text-sm font-sans font-medium px-6 py-2 rounded-md bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center gap-2"
                >
                  <span><IoMdRocket className="text-lg text-neutral-700" /></span>
                  Get Started Free
                </motion.button>
                <motion.button
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  whileHover={{ y: -3 }}
                  whileTap={{ y: -4 }}
                  className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer text-sm font-sans font-medium px-6 py-2 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center gap-2"
                >
                  View Documentation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="mb-20">
          <div className="border border-dashed p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Our Mission */}
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-t from-[#262626] to-[#525252] rounded-lg flex items-center justify-center">
                  <FaLightbulb className="text-2xl text-neutral-200" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-sans">Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm leading-relaxed">
                  To empower developers worldwide by providing the most intuitive, powerful, and reliable local development platform. We believe that great software starts with great tools, and we're committed to making local development accessible, efficient, and enjoyable for everyone—from beginners to enterprise teams.
                </p>
              </div>

              {/* Our Vision */}
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-t from-[#262626] to-[#525252] rounded-lg flex items-center justify-center">
                  <IoMdRocket className="text-2xl text-neutral-200" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-sans">Our Vision</h2>
                <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm leading-relaxed">
                  To become the global standard for local development environments, fostering a community where developers can build, test, and innovate without limitations. We envision a future where setting up a development environment is as simple as opening an app, enabling developers to focus on what they do best—creating amazing software.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-20">
          <div className="border border-dashed p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Our Core Values</h2>
              <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm max-w-2xl mx-auto">
                The principles that guide everything we do at Lokalhost.io
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Value 1 */}
              <div className="border border-dashed p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-t from-[#262626] to-[#525252] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaCode className="text-xl text-neutral-200" />
                </div>
                <h3 className="text-xl font-bold font-sans mb-2">Developer First</h3>
                <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm">
                  Every feature, every design decision is made with developers in mind. Your experience and productivity are our top priorities.
                </p>
              </div>

              {/* Value 2 */}
              <div className="border border-dashed p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-t from-[#262626] to-[#525252] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MdSpeed className="text-xl text-neutral-200" />
                </div>
                <h3 className="text-xl font-bold font-sans mb-2">Speed & Performance</h3>
                <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm">
                  Lightning-fast setup, blazing-fast performance. We optimize every millisecond so you can ship faster.
                </p>
              </div>

              {/* Value 3 */}
              <div className="border border-dashed p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-t from-[#262626] to-[#525252] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaShieldAlt className="text-xl text-neutral-200" />
                </div>
                <h3 className="text-xl font-bold font-sans mb-2">Security First</h3>
                <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm">
                  Your code and data are sacred. We implement industry-leading security practices to keep everything safe.
                </p>
              </div>

              {/* Value 4 */}
              <div className="border border-dashed p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-t from-[#262626] to-[#525252] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaUsers className="text-xl text-neutral-200" />
                </div>
                <h3 className="text-xl font-bold font-sans mb-2">Community Driven</h3>
                <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm">
                  Built by developers, for developers. We listen to our community and evolve based on your feedback.
                </p>
              </div>

              {/* Value 5 */}
              <div className="border border-dashed p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-t from-[#262626] to-[#525252] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MdSecurity className="text-xl text-neutral-200" />
                </div>
                <h3 className="text-xl font-bold font-sans mb-2">Reliability</h3>
                <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm">
                  Consistent, dependable, and always available. We build tools you can trust, every single day.
                </p>
              </div>

              {/* Value 6 */}
              <div className="border border-dashed p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-t from-[#262626] to-[#525252] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaLightbulb className="text-xl text-neutral-200" />
                </div>
                <h3 className="text-xl font-bold font-sans mb-2">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm">
                  We're constantly pushing boundaries, exploring new technologies, and finding better ways to solve problems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mb-20">
          <div className="border border-dashed p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Lokalhost.io in Numbers</h2>
              <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm max-w-2xl mx-auto">
                Join thousands of developers already building with Lokalhost.io
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold font-sans">50K+</div>
                <div className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm">Active Developers</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold font-sans">1M+</div>
                <div className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm">Projects Created</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold font-sans">99.9%</div>
                <div className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm">Uptime</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold font-sans">24/7</div>
                <div className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm">Support Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-20">
          <div className="border border-dashed p-8 md:p-12 lg:p-16">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold font-sans">
                Ready to Transform Your Development Workflow?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-sans font-medium text-sm md:text-base">
                Join the community of developers who are already experiencing the future of local development. Get started in minutes, no credit card required.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <motion.button
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  whileHover={{ y: -3 }}
                  whileTap={{ y: -4 }}
                  className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-50 dark:border-neutral-400 relative overflow-hidden cursor-pointer text-sm font-sans font-medium px-8 py-3 rounded-md bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center gap-2"
                >
                  <span><IoMdSend className="text-lg text-neutral-700" /></span>
                  Start Building Now
                </motion.button>
                <motion.button
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  whileHover={{ y: -3 }}
                  whileTap={{ y: -4 }}
                  className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer text-sm font-sans font-medium px-8 py-3 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]"
                >
                  Contact Sales
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage