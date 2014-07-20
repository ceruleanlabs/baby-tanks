require 'sinatra'

set :public_folder, __dir__ + '/dist'

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end
