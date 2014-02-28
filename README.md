# Ghost Tag Cloud Generator

This is a hacky little project that takes your Ghost blog engine export file, reads it in and spits out:

* Tag Cloud HTML
* Tag Posts Page HTML
* List of all posts to help with URL rewrites

It is not meant to be a long term solution.

Once the plugin API is available, there will be bunches of tag cloud plug-ins that will be better choices.

I used Visual Studio to create the project, so there are a couple of files (.sln and .njsproj) that you can ignore if you aren't using Visual Studio.

You don't need anything other than Node to run it, but you will need Node.

Once you have the project in a folder, drop your export file in that folder and run the app. It will spit out three .txt files as listed above.

I've also posted to my blog about this project at [jeffaBlog](https://ammonsonline.com/ghost-tag-cloud-hack).

For now, however, here is my hacky little Node.js app.

Hope it helps.

jeffa

