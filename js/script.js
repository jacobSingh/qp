/* Author: Jacob moffugging Singh

*/

(function($) {
  $(document).ready(function() {
    Poll = function() {
      var self = this;
      self.title = ko.observable("What's your favorite color [Click to rename]"),
      self.author = ko.observable(new User()),
      self.votingTypeName = 'updown',
      // @todo: restrtic to if author==person
      self.editable = true,
      self.choices = ko.observableArray([new Choice()]);

      // This doesn't belong here, but choicePlaceholders needs it...
      self.addChoice = function() {
        var choice = new Choice();
        self.choices.push(choice);
        return choice;
      }

      self.choiceBoxes = ko.computed(function() {
        var placeholders = ko.utils.arrayFilter(self.choices(), function(choice) {
          return !choice.title();
        });
        if (placeholders.length < 2) {
          self.addChoice();
        }

        return self.choices();
      });
    };

    var Choice = function() {
      var self = this;
      self.title = ko.observable();
      self.author = ko.observable(getApp().currentUser());
      self.votes = ko.observableArray();

      // When a title
      self.title.subscribe(function(newValue) {
        if (newValue.length) {
          self.author(getApp().currentUser());
        }
      });

      self.score = ko.computed(function() {
        var total = 0;
        for (i in self.votes()) {
          total += self.votes()[i].score;
        }
        return total;
      });

      self.addVote = function(score, user) {
        var vote = new Vote();
        vote.author = user;
        vote.score = score;
        self.votes.push(vote);
      }

      self.vote = function(choice, e) {
        var user = getApp().currentUser();
        var score = $(e.target).data('score');
        votesByUser = self.findVotesByUser(user);
        if (votesByUser.length > 0) {
          alert('you already voted');
          return;
        }
        self.addVote(score, user);
      };

      self.findVotesByUser = function(user) {
        return ko.utils.arrayFilter(self.votes(), function(vote) {
          return vote.author.name() == user.name();
        });
      }

      self.votesByCurrentUser = ko.computed(function() {
        console.log(self);
        return self.findVotesByUser(getApp().currentUser());
      });
    }

    var Vote = function() {
      var self = this;
      self.score = ko.observable(0),
      self.author = ko.observable(new User())
    }

    var User = function(username) {
      var self = this;
      username = username || "Anonymous";
      self.name = ko.observable(username),
      self.source = "Twitter, FB, etc"
      // self.notifications = Should map to something for email / tweets / etc.
    }

    var App = function() {
      var self = this;

      self.currentUser = ko.observable(new User());
      //self.currentUser().name = "Jacob";

      self.testLogin = function(app, e) {
        var username = $(e.target).data('name');
        self.currentUser(new User(username));
      }

      self.showPoll = function(poll) {
        self.poll = poll;
        ko.applyBindings(this), $('#poll-container')[0];
      }
    }

    function getApp(app) {
      return this.app;
    }

    window.app = new App();
    window.app.showPoll(new Poll());
    getApp.app = window.app;

  });
})(jQuery);
