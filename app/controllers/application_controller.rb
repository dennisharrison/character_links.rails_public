class ApplicationController < ActionController::Base
  require 'uuidtools'
  protect_from_forgery
  before_filter :common_content

  def common_content
    @request_uuid = UUIDTools::UUID.random_create.to_s
  end

end
