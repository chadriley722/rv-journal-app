class SessionsController < Devise::SessionsController
  def create
    super do |resource|
      redirect_to dashboard_path and return if resource.persisted?
    end
  end

  protected

  def after_sign_in_path_for(resource)
    dashboard_path
  end

  def after_sign_out_path_for(resource_or_scope)
    root_path
  end
end
