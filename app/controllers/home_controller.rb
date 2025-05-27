class HomeController < ApplicationController
  # Public landing page
  def index
    # Redirect to dashboard if user is already signed in
    redirect_to dashboard_path if user_signed_in?
  end

  # Dashboard page (requires authentication)
  def dashboard
    authenticate_user!
    # We'll add dashboard statistics and data here later
  end
end
