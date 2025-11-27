import React, { useState, useEffect } from 'react'

const articles = [
  {
    id: 1,
    title: '10 Tips to Crack Your First Technical Interview',
    category: 'Career Advice',
    author: 'John Smith',
    date: '2024-01-15',
    readTime: '5 min read',
    excerpt: 'Master the art of technical interviews with these proven strategies from industry experts.',
    image: 'interview',
  },
  {
    id: 2,
    title: 'Top 5 Programming Languages to Learn in 2024',
    category: 'Skill Development',
    author: 'Sarah Johnson',
    date: '2024-01-10',
    readTime: '8 min read',
    excerpt: 'Discover which programming languages are in high demand and how they can boost your career.',
    image: 'programming',
  },
  {
    id: 3,
    title: 'From Fresher to Frontend Developer: A Success Story',
    category: 'Career Advice',
    author: 'Priya Kumar',
    date: '2024-01-05',
    readTime: '6 min read',
    excerpt: 'Read how Ananya landed her dream job at a top tech company within 6 months of training.',
    image: 'success',
  },
  {
    id: 4,
    title: 'The Future of AI in Software Development',
    category: 'Industry Trends',
    author: 'Dr. Rajesh Verma',
    date: '2024-01-01',
    readTime: '10 min read',
    excerpt: 'Exploring how artificial intelligence is reshaping the software development landscape.',
    image: 'ai',
  },
  {
    id: 5,
    title: 'How to Build an Impressive Tech Portfolio',
    category: 'Skill Development',
    author: 'Mike Chen',
    date: '2023-12-28',
    readTime: '7 min read',
    excerpt: 'Learn the secrets to creating a portfolio that stands out to hiring managers.',
    image: 'portfolio',
  },
  {
    id: 6,
    title: 'Remote Work Trends: What Employers Look For',
    category: 'Industry Trends',
    author: 'Emily Davis',
    date: '2023-12-25',
    readTime: '6 min read',
    excerpt: 'Understanding the skills and qualities that make candidates successful in remote roles.',
    image: 'remote',
  },
  {
    id: 7,
    title: 'Navigating Salary Negotiations: A Complete Guide',
    category: 'Career Advice',
    author: 'David Brown',
    date: '2023-12-20',
    readTime: '9 min read',
    excerpt: 'Master the art of salary negotiation with confidence and get the compensation you deserve.',
    image: 'salary',
  },
  {
    id: 8,
    title: 'Cloud Computing Skills That Will Boost Your Career',
    category: 'Skill Development',
    author: 'Lisa Wang',
    date: '2023-12-18',
    readTime: '8 min read',
    excerpt: 'Essential cloud skills that are transforming the job market and how to acquire them.',
    image: 'cloud',
  },
  {
    id: 9,
    title: 'Student Success: From Zero Coding Experience to Full-Stack Developer',
    category: 'Career Advice',
    author: 'Rahul Patel',
    date: '2023-12-15',
    readTime: '5 min read',
    excerpt: 'Inspiring journey of a student who transformed their career through dedication and training.',
    image: 'coding',
  },
]

const categories = ['All', 'Career Advice', 'Skill Development', 'Industry Trends']

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [displayLimit, setDisplayLimit] = useState(6)

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory)
  
  const displayedArticles = filteredArticles.slice(0, displayLimit)
  const hasMore = filteredArticles.length > displayLimit

  // Reset display limit when category changes
  useEffect(() => {
    setDisplayLimit(6)
  }, [selectedCategory])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-linear-to-br from-primary-50 to-white border-b border-primary-200 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Insights, Tips & Industry News
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Stay updated with the latest career advice, skill development tips, and industry trends
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-6 bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_20px_50px_rgba(147,51,234,0.6)]'
                    : 'bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-xl hover:shadow-gray-400/30'
                }`}
              >
                {selectedCategory === category && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {displayedArticles.length} of {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No articles found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {/* Article Image Placeholder */}
                    <div className="h-48 bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📄</div>
                        <div className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                          {article.category}
                        </div>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.readTime}</span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h2>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-700">
                              {article.author.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-900">{article.author}</div>
                            <div className="text-xs text-gray-500">{formatDate(article.date)}</div>
                          </div>
                        </div>
                        <a
                          href={`#/blog/detail?id=${article.id}`}
                          className="text-primary-700 hover:text-primary-800 font-medium text-sm transition-all duration-300 ease-in-out hover:font-bold hover:shadow-sm inline-block"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setDisplayLimit(filteredArticles.length)}
                    className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-lg hover:scale-105 hover:bg-primary-700"
                  >
                    Load More Articles ({filteredArticles.length - displayLimit} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

