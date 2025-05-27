source "https://rubygems.org"

ruby "3.3.8"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 7.1.5", ">= 7.1.5.1"

# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem "sprockets-rails"

# Required for Sass compilation in the asset pipeline
gem "sassc-rails", "~> 2.1"

# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"

# Use JavaScript with ESM import maps [https://github.com/rails/importmap-rails]
gem "importmap-rails"

# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "turbo-rails"

# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem "stimulus-rails"

# Bundle and process CSS [https://github.com/rails/cssbundling-rails]
gem "cssbundling-rails"

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# Authentication solution
gem "devise", "~> 4.9"

# Authorization
gem "cancancan", "~> 3.5"

# Full-text search for PostgreSQL
gem "pg_search", "~> 2.3"

# Pagination
gem "kaminari", "~> 1.2"

# SEO-friendly URLs
gem "friendly_id", "~> 5.5"

# Background job processing
gem "sidekiq", "~> 7.2"

# Redis adapter for Action Cable and Sidekiq
gem "redis", ">= 4.0.1"

# Image processing for Active Storage
gem "image_processing", "~> 1.2"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ]
  
  # Testing framework
  gem "rspec-rails", "~> 6.1"
  
  # Test data generation
  gem "factory_bot_rails", "~> 6.4"
  
  # Fake data generator
  gem "faker", "~> 3.2"
  
  # Code coverage
  gem "simplecov", require: false
  
  # Ruby linting and code quality
  gem "rubocop", "~> 1.62", require: false
  gem "rubocop-rails", "~> 2.24", require: false
  gem "rubocop-rspec", "~> 2.27", require: false
  
  # Security scanning
  gem "brakeman", "~> 6.1", require: false
  
  # N+1 query detection
  gem "bullet", "~> 7.1"
  
  # Database cleaning for tests
  gem "database_cleaner-active_record", "~> 2.1"
  
  # Performance testing
  gem "benchmark-ips", require: false
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"
  
  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  gem "rack-mini-profiler", "~> 3.3"
  
  # Improves error messages
  gem "better_errors", "~> 2.10"
  gem "binding_of_caller", "~> 1.0"
  
  # Checks for missing foreign keys
  gem "lol_dba", "~> 2.4"
  
  # Entity-relationship diagrams
  gem "rails-erd", "~> 1.7"
  
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara"
  gem "selenium-webdriver"
  
  # Helpers for testing ActionMailer
  gem "email_spec", "~> 2.2"
  
  # Mocking library
  gem "mocha", "~> 2.1"
  
  # System testing helpers
  gem "cuprite", "~> 0.15"
  
  # Request testing helpers
  gem "webmock", "~> 3.19"
  gem "vcr", "~> 6.2"
end

group :production do
  # Error tracking
  # gem "sentry-ruby", "~> 5.17"
  # gem "sentry-rails", "~> 5.17"
  
  # Application performance monitoring
  # gem "skylight", "~> 5.5"
  
  # Asset storage in production
  # gem "aws-sdk-s3", "~> 1.143", require: false
end
