"use strict";

var fs = require('fs');
var file = __dirname + '/GhostData.json'; // The default export file for ghost in the current dir
var tags = {};
var tagsArr = [];
var posts = {};
var maxPosts = 0;
var minPosts = 1;

//
// STUFF TO EDIT <-- Set true or false for these two
//
// Should permalinks include date?
// Should redirect use day?
// Currently ghost's only option is to include the full yyyy/mm/dd/post date in
// the link. WordPress is super flexible, and mine were yyyy/mm/post.
// The useDayForRedirects give me a list of all posts if I want to create
// redirects.
// Ex. /2013/12/21/this-is-my-post
//     /2013/12/this-is-my-post
var useDate = true;
var useDayForRedirects = false;

// Used to group the tags in the tag cloud by number of posts
// Not super statistical. Just a rough whack at grouping.
// This ain't rocket surgery.
// q1 is the minimum number of posts (or 1)
// q3 is the mid point
// q5 is the max number of posts
var q1 = 0;
var q2 = 0;
var q3 = 0;
var q4 = 0;
var q5 = 0;

// strings that will be output to files
var tagsPageHtml = '<div id="tag-listing">\n';
var tagCloudHtml = '<div id="tag-cloud">\n';
var postListForRedirects = '';

fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log('Error ' + err);
            return;
        }

        var blogData = JSON.parse(data);

        for (var i = 0; i < blogData.data.tags.length; i += 1) {
                var newTag = blogData.data.tags[i];

                tags[newTag.id] = { 'name' : newTag.name, 'posts' : [] };
        }

        for (var i = 0; i < blogData.data.posts.length; i += 1) {
            var newPost = blogData.data.posts[i];

            posts[newPost.id] = newPost;
        }

        for (var i = 0; i < blogData.data.posts_tags.length; i += 1) {
            var newPostsTag = blogData.data.posts_tags[i];

            var curPost = posts[newPostsTag.post_id];

            tags[newPostsTag.tag_id].posts.push(curPost);
        }

        for (var tagIdx in tags) {
            var curTag = tags[tagIdx];

            tagsArr.push(curTag);
        }

        tagsArr = tagsArr.sort(function (first, second) {
            if (first.posts.length === second.posts.length) {
                return 0;
            }
            if (first.posts.length < second.posts.length) {
                return 1;
            } else {
                return -1;
            }
        });

        for (var i = 0; i < tagsArr.length; i += 1) {
            var curTag = tagsArr[i];

            if (curTag.posts.length > 0) {

            var heading = '<h2><a id="' + curTag.name + '">' + curTag.name + '</a></h2>\n<ul>\n';
            tagsPageHtml += heading;

            if (curTag.posts.length >= maxPosts) {
                maxPosts = curTag.posts.length;
            }

            if (curTag.posts.length <= minPosts) {
                minPosts = curTag.posts.length;
            }

            for (var x = 0; x < curTag.posts.length; x += 1) {
                var curPost = curTag.posts[x];
                var pubDate = new Date(curPost.published_at);

                var year = pubDate.getFullYear();
                var month = pubDate.getMonth() + 1;
                var day = pubDate.getDate();

                var monthStr = '00' + month.toString();
                var dayStr = '00' + day.toString();

                monthStr = monthStr.substring(monthStr.length - 2);
                dayStr = dayStr.substring(dayStr.length - 2);

                var link;

                if (useDate) {
                    link = year + '/' + monthStr + '/' + dayStr + '/' + curPost.slug;
                    postListForRedirects += year + '/' + monthStr + '/' + (useDayForRedirects ?  dayStr + '/' : '') +  curPost.slug + '\n';
                    } else {
                        link = curPost.slug;
                        postListForRedirects += link + '\n';
                        }

                var listItems = '<li><a href="/' + link + '">' + curPost.title + '</a></li>\n';
                tagsPageHtml += listItems
            }
            tagsPageHtml += '</ul>\n';
            }
        }

        q1 = minPosts;
        q5 = maxPosts;
        q3 = Math.floor((q5 - q1)/2);
        q4 = Math.floor(((q5 - q3)/2) + q3);
        q2 = Math.floor(q3 - ((q3 - q1)/2));

        tagsArr = tagsArr.sort(function (first, second) {
            if (first.name.toUpperCase() === second.name.toUpperCase) {
                return 0;
            }
            if (first.name.toUpperCase() < second.name.toUpperCase()) {
                return -1;
            } else {
                return 1;
            }
        });

        for (var i = 0; i < tagsArr.length; i += 1) {
            var curTag = tagsArr[i];
            var curCount = curTag.posts.length;

            var curRank = 1;

            if (curCount > 0) {

            if (curCount >= q4 ) {
                curRank = 5;
                } else if ( curCount >= q3) {
                    curRank = 4;
                    } else if (curCount >= q3) {
                        curRank = 3;
                        } else if (curCount >= q2) {
                            curRank = 2;
                            } else {
                                curRank = 1;
                                }
            

            tagCloudHtml += '<a href="/posts-by-tag/#' + curTag.name + '" class="tag-cloud-size-' + curRank + '">' + curTag.name + '</a> ';
            }
        }

        tagCloudHtml += '\n</div>';

        fs.writeFile('tagPage.txt', tagsPageHtml, function(err) {
            if (err) throw err;
            console.log("Saved Tag Page");
            });

        fs.writeFile('tagCloud.txt', tagCloudHtml, function(err) {
            if (err) throw err;
            console.log("Saved Tag Cloud");
            });
            
        fs.writeFile('postListForRedirects.txt', postListForRedirects, function(err) {
            if (err) throw err;
            console.log("Saved Tag Cloud");
            });
            

    });


