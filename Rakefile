require 'pathname'

def mocha(files)
  sh './bin/mocha ' + files.shuffle.join(' ')
end

desc 'Run tests'
task :test do
  mocha FileList['test/*.ls']
end

namespace :npm do
  desc "npm install"
  task :install do
    # Make sure that we don’t use node_modules across Node versions
    node_v         = `node -v`.chomp
    npm_dir_node_v = Pathname('node_modules/.node_version')

    if !npm_dir_node_v.exist? || npm_dir_node_v.read != node_v
      rm_rf('./node_modules')
    end

    sh 'npm install'
    fail("`npm install' failed") if $?.exitstatus != 0

    npm_dir_node_v.open('wb') { |f| f.write(node_v) }
  end
end
