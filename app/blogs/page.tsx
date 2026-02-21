"use client"
import { useState } from 'react';
import { motion } from 'motion/react';
import { IoMdSend } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

function Page() {
  // Sample blog data - replace with your actual blog data
  const blogs = [
    {
      id: 1,
      title: "Building Scalable Web Applications with Modern Tools",
      excerpt: "Learn how to build scalable web applications using the latest technologies and best practices in 2024.",
      date: "Feb 5, 2024",
      readTime: "5 min read",
      category: "Development",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
    },
  ]

    const [activeFilter, setActiveFilter] = useState<'All' | 'Guide' | 'latest' | 'Lokalhost.io' | 'Public'>('All');
  

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
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            Lokalhost.io Blogs Latest
          </h1>
          <p className="text-sm font-sans font-medium text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover insights, tutorials, and the latest updates from our team. Stay ahead with cutting-edge development practices and industry trends.
          </p>
        </div>

        {/* Featured Blog Section */}
        <div className="mb-20 group">
          <div className="relative border border-dashed overflow-hidden transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Left Side - Image */}
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop"
                  alt="Featured blog"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                    Featured
                  </span>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="flex flex-col justify-start space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-sans text-gray-900 dark:text-white mt-3 mb-4">
                    Revolutionizing Local Development with Lokalhost.io
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-sans font-medium">
                    Dive deep into how Lokalhost.io is transforming the way developers work locally. From seamless environment setup to powerful collaboration tools, discover why thousands of developers are making the switch. Learn about our innovative approach to local hosting.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-2 font-sans font-medium text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    12 min read
                  </span>
                  <span className="flex items-center gap-2 font-sans font-medium text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    2.4k views
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-start gap-4 pt-4">
                          <motion.button
                            transition={{ duration: 0.28 , ease: "easeInOut"}}
                            whileHover={{ y: -3 }}
                            whileTap={{ y: -4 }}
                          className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-50 dark:border-neutral-400 relative overflow-hidden cursor-pointer text-sm font-sans font-medium px-6 py-2 rounded-md bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center gap-2"><span><IoMdSend className="text-lg text-neutral-700"/></span>Read full article</motion.button>
                          <motion.button
                              transition={{ duration: 0.28 , ease: "easeInOut"}}
                              whileHover={{ y: -3}}
                              whileTap={{ y: -4 }}
                          className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer text-sm font-sans font-medium px-6 py-2 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">Build with lokalhost.io
                          </motion.button>
                          
                        </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid Section */}
        <div className="border border-dashed lg:p-10 p-4">
          <div className="flex items-center justify-between flex-wrap pb-8 gap-4">
            <div className='order-2 md:order-1 lg:order-1'>
              <h1 className='font-sans text-3xl lg:text-4xl font-bold'>Latest Blogs</h1>
            </div>
            <div className="flex gap-2">
              <ButtonGroup>
                        <Button 
                            variant={activeFilter === 'All' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('All')}
                            className={activeFilter === 'All' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            All
                        </Button>
                        <Button 
                            variant={activeFilter === 'Guide' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('Guide')}
                            className={activeFilter === 'Guide' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            Guide
                        </Button>
                        <Button 
                            variant={activeFilter === 'latest' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('latest')}
                            className={activeFilter === 'latest' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            Latest
                        </Button>
                        <Button 
                            variant={activeFilter === 'Public' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('Public')}
                            className={activeFilter === 'Public' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            Public
                        </Button>
                        <Button 
                            variant={activeFilter === 'Lokalhost.io' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('Lokalhost.io')}
                            className={activeFilter === 'Lokalhost.io' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            Lokalhost.io
                        </Button>
                    </ButtonGroup>
            </div>
          </div>

          {/* Blog Cards Grid */}
          <div className="lg:mt-7 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog.id}
                className="group shadow-sm border border-dashed overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Blog Image */}
                <div className="relative overflow-hidden aspect-[16/10] p-2">
                  <img 
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 rounded-sm"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-sans font-medium text-sm">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold font-sans text-gray-900 dark:text-white line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 font-sans font-medium text-sm">
                    {blog.excerpt}
                  </p>

                  <button className="transition-all duration-300 flex gap-2 border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer text-sm font-sans font-medium px-4 py-1 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
