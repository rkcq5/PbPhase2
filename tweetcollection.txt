using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tweetinvi;
using Tweetinvi.Core;
using Tweetinvi.Core.Credentials;
using Tweetinvi.Core.Enum;
using Tweetinvi.Core.Extensions;
using Tweetinvi.Core.Interfaces;
using Tweetinvi.Core.Interfaces.Controllers;
using Tweetinvi.Core.Interfaces.DTO;
using Tweetinvi.Core.Interfaces.Models;
using Tweetinvi.Core.Interfaces.Streaminvi;
using Tweetinvi.Core.Parameters;
using Tweetinvi.Json;

namespace TweetCollection
{
    class Program
    {
        static void Main(string[] args)
        {
            Auth.SetUserCredentials("tC1twsMqrcC60ggaEGuEuxtOh", "Xd8XOmY4j6mmCXI4cnXSiAyx9K1QzAEzu1EszTYrVRLVI4WtVs", "1848764503-lUnTG2FWpLBmg5mknUJpJKEUyIsKTwbMxJLuloG", "C5uKf5UXqa2LUfD1omqvPYIdsUyF09Vg5A5JKAUDro3HX");

            TweetinviEvents.QueryBeforeExecute += (sender, args1) =>
            {
                Console.WriteLine(args1.QueryURL);
            };
            mainClass.Search_SimpleTweetSearch();
            Console.WriteLine(@"END");
            Console.ReadLine();
        }

    }
    static class mainClass
    {
        public static void Search_SimpleTweetSearch()
        {

            var searchParameter = Search.CreateTweetSearchParameter("@timesnow");
            searchParameter.MaximumNumberOfResults = 0000;
            var tweets = SearchJson.SearchTweets(searchParameter);
            System.IO.StreamWriter file = new System.IO.StreamWriter("timesnow.json", true);
            foreach (var tweet in tweets)
            {
                String replacedString = tweet.Replace("{\"statuses\":[", ""); 
                string replacedString2 = replacedString.Replace("},{\"metadata\":", "}\n{\"metadata\":");
                string removedString = replacedString2.Remove(replacedString2.IndexOf("],\"search_metadata"));
                file.WriteLine(removedString);
                file.Flush(); 
            }
            file.Close();
        }
    }
}