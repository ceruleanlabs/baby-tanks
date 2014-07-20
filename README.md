# BABY TANKS

## Deploying to GitHub Pages

Use [this guide](https://help.github.com/articles/creating-project-pages-manually).
So assuming you originally cloned the game into `casual_jam`,

    $ git clone git@github.com:forkit/casual_jam.git casual_jam_deploy
    $ cd $_
    $ git co gh-pages
    $ cp -r ../casual_jam/dist/ .
    $ git add -A
    $ git ci -m 'deploy'
    $ git push

I recommend keeping this in a separate directory in your workspace and then
updating it whenever you want to deploy.
