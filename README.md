# pomodoro-clock
Pomodoro Clock is the project developed according to FCC specification.
The project is based on [the pomodoro technique](https://en.wikipedia.org/wiki/Pomodoro_Technique).

To see the result go to [live preview here](http://theonewhodo.es/pomodoro/)

A user can **customize work (session) time and break time** of each pomodoro cycle (pomodoro clock).
A user can **reset the settings for each new pomodoro**. Reset reloads the settings to previous user's choices regarding time spans.
Refreshing the page in a browser window reloads the clocks to standard 25 and 5 time spans. In this way the reset is more customizable and usable for a given taste.

The passing time is animated in both timers.
After a work session finishes the whole area of this clock fades out to lead user's attention to a break time.
The same animation is added when a break finishes. The reset option becomes visible after the whole cycle.
There is **an audio alarm** implemented when a work session finishes. Additional alarm is added after a break, to mark it for users who really take a break to relax far away from the screen.

At the top input form a user may **introduce their goal** for a given pomodoro cycle.
A user may **go social** with the progress of their work by tweeting the current work progress during or after the work session finished. The tweetable progress time gets updated with the passing work time. 
In order to **check and compare previous pomodoro cycles** and own productivity, the cycles are kept in local storage.
