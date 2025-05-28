Rails.application.routes.draw do
  # Devise routes for authentication
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    sign_up: 'register'
  }, controllers: {
    registrations: 'registrations',
    sessions: 'sessions'
  }
  
  # Root route
  root to: 'home#index'
  
  # Home page route
  get 'home', to: 'home#index'
  get 'dashboard', to: 'home#dashboard'
  
  # User profile routes
  resources :profiles, only: [:show, :edit, :update]
  
  # RV management routes (to be implemented)
  resources :rvs do
    resources :maintenance_records, shallow: true
    member do
      patch :remove_image
    end
  end
  
  # Journal entry routes (to be implemented)
  resources :journal_entries do
    collection do
      get 'search'
    end
  end
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Root path is already defined at the top of the file
end
