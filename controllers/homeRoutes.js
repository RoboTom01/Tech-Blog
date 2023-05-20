const router = require('express').Router();
const { Post, User, Comment } = require('../models');
// const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

// res.json(posts)

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts
      , 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        User,
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    const post = postData.get({ plain: true });

// res.json(post)

    res.render('singlePost', {
      post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/comments', async (req, res) => {
    try {

      const commentData = await Comment.findAll({
        // include: [
        //   {
        //     model: User,
        //     attributes: ['username'],
        //   },
        // ],
      });
  
      // Serialize data so the template can read it
      const comments = commentData.map((comment) => comment.get({ plain: true }));
  
//   res.json(comments)
  
      // Pass serialized data and session flag into template
      res.render('homepage', { 
        comments, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
});



// router.get('/profile', withAuth, async (req, res) => {
//   try {
//     // Find the logged in user based on the session ID
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Post }],
//     });

//     const user = userData.get({ plain: true });

//     res.render('profile', {
//       ...user,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/signup', (req, res) => {

    if (req.session.logged_in) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('signup');
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

router.get('/logout', (req, res) => {

    // if (req.session.logged_in) {
    //   res.redirect('/dashboard');
    //   return;
    // }
  
    res.render('logout');
});

router.get('/newPost', (req, res) => {

    res.render('newPost');
});

module.exports = router;
