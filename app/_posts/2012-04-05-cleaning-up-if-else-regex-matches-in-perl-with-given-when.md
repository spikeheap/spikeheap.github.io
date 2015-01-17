---
author: spikeheap
comments: true
date: 2012-04-05 08:58:22+00:00
layout: post
slug: cleaning-up-if-else-regex-matches-in-perl-with-given-when
title: Cleaning up if-else regex matches in Perl with given-when
wordpress_id: 140
tags:
- perl
- programming regular-expressions
---

One of our applications written in Perl parses large text files to collect information about it. We've ended up applying it (over time) to various different areas, and we're now in a position where we create new versions regularly.

As we started re-using what was then a simple script, we took the obvious step to abstract the common code into a central library. Now we're not re-using code, the individual 'parser' scripts are effectively just if-else blocks matching the different lines:

```perl
use strict;
use warnings;

# For each line in the file
my $line = $_;

if(my ($name, $age) = $line =~ /My name is ([A-Za-z]+) and I am (\d+) years old/){
	$personbuilder->addPerson($name, $age);
}elsif($line =~ /I like Perl/){
	$personbuilder->addPreference("Perl");
}
# ... imagine a whole load more elsif statements here 
else{
	$logger->error("Line not matched: "+$line);
	die;
}
```

The above is a contrived example, but line 3 demonstrates the problem of collecting multiple groups from the regular expression match. As the number of groups increases the whole line becomes a bit unreadable. The main problem is it's really easy to add an *if* rather than an *elsif* and your whole script breaks down.

So while I was doing some routine maintenance of a script the other day I found the Perl **given/when** construct. It doesn't have the advantage of being immediately recognisable to anyone who's ever programmed, but is fairly intuitive:

```perl
use strict;
use warnings;
use v5.10;

for(my $i = 0; $i &lt; 10; $i++){
	my $line = "This contains $i winnings for ";
	$line .= "the ${i}th winnner.";
	
	if($i % 3 == 0){
		$line = "no dice";
	}	
	
	given($line){
		when(/This contains (\d+) winnings for (.*)/){
			my $winnings = $1;
			my $winner = $2;
			print "Amount: ".$winnings ."\n";
			print "Winner: " .$winner . ".\n";
		}
		when(/no dice/){
			print "\t". $_ . "\n";
		}
		default { 
			print "NOT MATCHED\n";
		} 
	}
}
```

The above code provides a nice safeguard in that a *when* can only mean one thing, and can't be swapped out for an *if*. Breaking it down into multiple *given* blocks is more obvious and requires more effort, so it's harder to introduce and easier to fix bugs.

The *when* statement uses Perl's smart matching feature, so you can use Strings, numbers, regular expressions or booleans, with some caveats about how clever it is. Read more here: [http://perldoc.perl.org/perlsyn.html](http://perldoc.perl.org/perlsyn.html) and here: [http://szabgab.com/smart-matching-in-perl-5.10.html](http://szabgab.com/smart-matching-in-perl-5.10.html)
