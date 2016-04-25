# node-cli-play
Just trying out some cli app ideas in node.  Ruby is so slow and node backed by v8 isn't.

# usage notes

(wip.  This is brainstorming rather than a feature list)
/***************************************
 * Let's take a stab at figuring out what the cli syntax should look like
 
 spotifyr
 # no idea what's the default

 spotifyr next|previous|pause
 # these seem fine.  should they be noisy?  maybe that requires a flag.
 # metadata -> status.  

 spotifyr search
 spotifyr search album
 spotifyr search artist
 # dmenu search for anything or a particular thing

 spotifyr search rush
 spotifyr search album rush
 spotifyr search artist rush
 # ugh, do i need flags
 
 spotifyr search rush -> search all the things
 spotifyr album rush -> album search
 # maybe search's arg is the search term and album/artist/etc are more specific searches.  should search be find or is that rubyish?
 # so far so goood....

 # how about radio/related
 # starred?
 # text search is fine, but prepop lists are nice too
 ## artist/myartists

 spotifyr my/starred
 spotifyr myartists/my_artists
 # lists all starred vs artists starred
 
 spotifyr related_artists
 spotifyr artists_albums 
 # searches off of current artist selection


 # open questions
 enqueueing instead of playing
 radio station/genre search


***************************************/
