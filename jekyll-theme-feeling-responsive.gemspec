Gem::Specification.new do |s|
  s.name = 'Leee Jeffries Blog Site'
  s.version = '1.0'
  s.date = '2023-01-03'
  s.summary = 'A free template feeling responsive was used for this site.'
  s.description = <<EOD
== Feeling Responsive
A free flexible theme for Jekyll built on Foundation framework.
You can use it for your company site, as a portfolio or as a blog.
See the [home page](http://phlow.github.io/feeling-responsive/) to get a
look at the theme and read about its features.
See the [documentation](http://phlow.github.io/feeling-responsive/documentation/)
to learn how to use the theme effectively in your Jekyll site.
EOD
  s.authors = ['Leee Jeffries']
  s.email = ['https://leeej84.github.io/contact']
  s.files = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|LICENSE|README)}i) }
  s.homepage = 'https://leeej84.github.io'
  s.license = 'MIT'
end