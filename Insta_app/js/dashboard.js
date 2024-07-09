document.addEventListener('DOMContentLoaded', () => {
    const dashboard = document.querySelector('#dashboard');
  
    dashboard.innerHTML = `
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-3 messages">
            <!-- Messages Section -->
            <ul class="sidebar-nav">
              <li>
                  <a href=""><i class="gi gi-stopwatch sidebar-nav-icon"></i><span class="sidebar-nav-mini-hide">Message</span></a>
              </li>
              <li>
                  <a href=""><i class="gi gi-show_big_thumbnails sidebar-nav-icon"></i><span class="sidebar-nav-mini-hide">Message</span></a>
              </li>
              <li>
                  <a href=""><i class="gi gi-show_big_thumbnails sidebar-nav-icon"></i><span class="sidebar-nav-mini-hide">Notification</span></a>
              </li>
            </ul>
          </div>
          <div class="col-md-6 posts" id="posts">
            <!-- Posts Section -->
          </div>
          <div class="col-md-3 userprofile" id="userprofile">
            <!-- User Profile Section -->
          </div>
        </div>
      </div>
    `;
  
    const token = localStorage.getItem('access');
  
    fetch('http://127.0.0.1:8000/postlist/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 403) {
          window.location.href = 'index.html';
        }
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const postsDiv = document.getElementById('posts');
      postsDiv.innerHTML = '';
  
      data.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
  
        // Check if there are images or videos to display
        if (post.post_images_videos && post.post_images_videos.length > 0) {
          let currentIndex = 0; // Index to track current image in array
          const mediaArray = post.post_images_videos;
  
          const mediaElement = document.createElement('img');
          mediaElement.src = mediaArray[currentIndex].file;
          mediaElement.alt = 'image';
          mediaElement.width = 200;
          mediaElement.height = 200;
  
          postDiv.appendChild(mediaElement);
  
          // Function to update media content based on currentIndex
          const updateMedia = () => {
            mediaElement.src = mediaArray[currentIndex].file;
            updateButtonsVisibility();
          };
  
          // Function to update visibility of navigation buttons
          const updateButtonsVisibility = () => {
            prevButton.style.display = currentIndex > 0 ? 'inline-block' : 'none';
            nextButton.style.display = currentIndex < mediaArray.length - 1 ? 'inline-block' : 'none';
          };
  
          // Button for previous image
          const prevButton = document.createElement('button');
          prevButton.textContent = 'Previous';
          prevButton.style.display = 'none'; // Initially hide previous button
          prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + mediaArray.length) % mediaArray.length;
            updateMedia();
          });
          postDiv.appendChild(prevButton);
  
          // Button for next image
          const nextButton = document.createElement('button');
          nextButton.textContent = 'Next';
          nextButton.style.display = mediaArray.length > 1 ? 'inline-block' : 'none'; // Show only if more than one media file
          nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % mediaArray.length;
            updateMedia();
          });
          postDiv.appendChild(nextButton);
  
          // Initially update buttons visibility
          updateButtonsVisibility();
        }
  
        const contentParagraph = document.createElement('p');
        contentParagraph.textContent = post.content;
        postDiv.appendChild(contentParagraph);
  
        // Like button
        const likeButton = document.createElement('button');
        likeButton.textContent = 'Like';
        likeButton.className = 'like-button';
        likeButton.style.marginTop = '10px'; // Adjust styling as needed
        // Check if current user has liked the post
        if (post.user_has_liked) {
          likeButton.classList.add('liked');
        }
        likeButton.addEventListener('click', () => {
          // Simulate toggling like (you'll need to implement this with your backend)
          fetch(`http://127.0.0.1:8000/likepost/${post.id}/`, {
            method: 'get',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then(data => {
            // Toggle liked class based on response
            if (likeButton.classList.contains('liked')) {
              likeButton.classList.remove('liked');
            } else {
              likeButton.classList.add('liked');
            }
          })
          .catch(error => {
            console.error('Error liking post:', error);
          });
        });
        postDiv.appendChild(likeButton);
  
        // Comment button
        const commentButton = document.createElement('button');
        commentButton.textContent = 'Comment';
        commentButton.className = 'comment-button';
        commentButton.style.marginTop = '10px'; // Adjust styling as needed
        commentButton.addEventListener('click', () => {
          // Implement your logic to handle commenting
          console.log('Comment button clicked for post:', post.id);
        });
        postDiv.appendChild(commentButton);
  
        const likesParagraph = document.createElement('p');
        likesParagraph.textContent = `Likes (${post.total_likes})`;
        postDiv.appendChild(likesParagraph);
  
        postsDiv.appendChild(postDiv);
      });
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
    });
  
    // Fetch user profile or other related information if needed
    // Example: fetch('http://127.0.0.1:8000/userprofile/', { method: 'GET', ... });
  });
  