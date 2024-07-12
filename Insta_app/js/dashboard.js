document.addEventListener('DOMContentLoaded', (event) => {
    const dashboard = document.querySelector('#dashboard');
    event.preventDefault();
    dashboard.innerHTML = `
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-2 sidebar">
            <ul class="sidebar-nav">
              <li><a href="#" id="home-link">Home</a></li>
              <li><a href="#" id="addpost-link">Add post</a></li>
              <li><a href="#" id="message-link">Message</a></li>
              <li><a href="#" id="notification-link">Notification</a></li>
              <li><a href="#" id="logout-link">Logout</a></li>
            </ul>
          </div>
          <div class="col-md-6 posts" id="posts">
            <!-- Posts Section -->
          </div>
          <div class="col-md-6 addpost" id="addpost" style="display: none;">
            <!-- User addpost Section -->
          </div>
          <div class="col-md-6 messages" id="messages" style="display: none;">
            <!-- User Profile data Section -->
          </div>
          <div class="col-md-6 friendrequests" id="friendrequests" style="display: none;">
            <!-- Friend Requests Section -->
          </div>
          <div class="col-md-6 userprofile-data" id="userprofile-data" style="display: none;">
            <!-- User Profile data Section -->
          </div>
          <div class="col-md-6 edit-userprofile-data" id="edit-userprofile-data" style="display: none;">
            <!-- User Profile data Section -->
          </div>
          <div class="col-md-3 userprofile" id="userprofile">
            <!-- User Profile Section -->
          </div>
        </div>
      </div>
    `;

    const token = localStorage.getItem('access');
    const user_id = localStorage.getItem('user_id');
    const postsDiv = document.getElementById('posts');
    const friendRequestsDiv = document.getElementById('friendrequests');
    const edit_userprofile_data = document.getElementById('edit-userprofile-data');
    const userProfileDiv = document.getElementById('userprofile-data');
    const addpostDiv = document.getElementById('addpost');

    const messagesDiv = document.getElementById('messages');

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/postlist/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 403 || response.status === 400) {
                    window.location.href = 'index.html';
                }
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            return data
         
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const fetchPostsUser = () => {
        return fetch('http://127.0.0.1:8000/post/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 400) {
                        window.location.href = 'index.html';
                    }
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            });
    };

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/userprofile/${user_id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 403 || response.status === 400) {
                    window.location.href = 'index.html';
                }
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch user profile failed:', error);
            throw error;
        }
    };


    const fetchConversations = () => {
        return fetch(`http://127.0.0.1:8000/conversation/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 403 || response.status === 400) {
                    window.location.href = 'index.html';
                }
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        });
    };

    const fetchFriendRequests = () => {
        return fetch(`http://127.0.0.1:8000/friendrequestaccepted/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 400) {
                        window.location.href = 'index.html';
                    }
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            });
    };

    const renderPosts = (data) => {

        postsDiv.innerHTML = '';
        console.log("=======", data);
        data.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            const username = document.createElement('div');
            username.textContent = post.user_name;
            postDiv.appendChild(username);

            if (post.post_images_videos && post.post_images_videos.length > 0) {
                let currentIndex = 0;
                const mediaArray = post.post_images_videos;

                const mediaElement = document.createElement('img');
                mediaElement.src = mediaArray[currentIndex].file;
                mediaElement.alt = 'image';
                mediaElement.width = 200;
                mediaElement.height = 200;

                postDiv.appendChild(mediaElement);

                const updateMedia = () => {
                    mediaElement.src = mediaArray[currentIndex].file;
                    updateButtonsVisibility();
                };

                const updateButtonsVisibility = () => {
                    prevButton.style.display = currentIndex > 0 ? 'inline-block' : 'none';
                    nextButton.style.display = currentIndex < mediaArray.length - 1 ? 'inline-block' : 'none';
                };

                const prevButton = document.createElement('button');
                prevButton.textContent = 'Previous';
                prevButton.style.display = 'none';
                prevButton.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + mediaArray.length) % mediaArray.length;
                    updateMedia();
                });
                postDiv.appendChild(prevButton);

                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next';
                nextButton.style.display = mediaArray.length > 1 ? 'inline-block' : 'none';
                nextButton.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % mediaArray.length;
                    updateMedia();
                });
                postDiv.appendChild(nextButton);

                updateButtonsVisibility();
            }

            const contentParagraph = document.createElement('p');
            contentParagraph.textContent = post.content;
            postDiv.appendChild(contentParagraph);

            const likeButton = document.createElement('button');
            likeButton.innerHTML = '<i class="fa fa-heart" style="font-size:20px;color:green"></i>';
            likeButton.className = 'like-button';
            if (post.has_like) {
                likeButton.innerHTML = '<i class="fa fa-heart" style="font-size:20px;color:red"></i>';
            }
            likeButton.addEventListener('click', (event) => {
                event.preventDefault();
                fetch(`http://127.0.0.1:8000/likepost/${post.id}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (post.has_like) {
                            likeButton.innerHTML = '<i class="fa fa-heart" style="font-size:20px;color:red"></i>';
                        } else {
                            likeButton.innerHTML = '<i class="fa fa-heart" style="font-size:20px;color:green"></i>';
                        }
                        loadDashboard()
                    })
                    .catch(error => {
                        console.error('Error liking post:', error);
                    });
            });
            postDiv.appendChild(likeButton);

            const commentButton = document.createElement('button');
            commentButton.innerHTML = '<i class="fa fa-comments-o" style="font-size:20px"></i>';
            commentButton.className = 'comment-button';
            commentButton.setAttribute('data-toggle', 'modal');

            commentButton.addEventListener('click', () => {
                openModal(post.id, post.comments);
            });

            postDiv.appendChild(commentButton);
            const likesParagraph = document.createElement('p');
            likesParagraph.textContent = `Likes (${post.total_likes})`;
            postDiv.appendChild(likesParagraph);

            postsDiv.appendChild(postDiv);
        });
    };

    const modal = document.getElementById('commentModal');
    const span = document.getElementsByClassName('close')[0];
    const submitCommentButton = document.getElementById('submitComment');

    function openModal(postID, postcomments) {
       
        const comments = Array.isArray(postcomments) ? postcomments : [postcomments];

        const postcommentdiv = document.getElementById('postcommentdiv')
        postcommentdiv.innerHTML = ''
        comments.forEach(comment => {

            const commentHtml = `
                    <div class="DivComment">
                        ${comment.content}
                    </div>
                `;
            postcommentdiv.innerHTML += commentHtml;
        });
        submitCommentButton.setAttribute('data-postid', postID);
        modal.style.display = 'block';
    }

    function closeModal() {
        loadDashboard()
        modal.style.display = 'none';
    }

    span.onclick = () => {
        closeModal();
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };

    submitCommentButton.addEventListener('click', () => {
        const commentInput = document.getElementById('commentInput');
        const commentText = commentInput.value;
        const postID = submitCommentButton.getAttribute('data-postid');
        if (commentText) {
            
            commentInput.value = '';

            
            const postData = {
                post_id: postID,
                comment: commentText
            };

            
            fetch('http://127.0.0.1:8000/addcommentpost/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                    
                },
                body: JSON.stringify(postData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); 
                })
                .then(data => {
                   
                    closeModal(); 
                })
                .catch(error => {
                    console.error('Error posting comment:', error);
                });
        }
    });

    const renderUserProfile = (data) => {
        const userProfileDiv = document.getElementById('userprofile');
        userProfileDiv.innerHTML = '';

        const profileImage = document.createElement('img');
        profileImage.id = 'profile-image';
        profileImage.src = data.profile_img;
        profileImage.alt = 'Profile Image';
        profileImage.width = 100;
        profileImage.height = 100;

        const username = document.createElement('p');
        username.textContent = data.username;

        userProfileDiv.appendChild(profileImage);
        userProfileDiv.appendChild(username);
    };

    const renderFriendRequests = (data) => {
        friendRequestsDiv.innerHTML = '';
        data.forEach(request => {
            const requestDiv = document.createElement('div');
            requestDiv.className = 'request';
            const profileImg = document.createElement('img');
            profileImg.src = request.from_user_img;
            profileImg.alt = 'Profile Image';
            profileImg.style.width = '50px'; 
            profileImg.style.height = '50px'; 
            profileImg.style.borderRadius = '50%'; 
            requestDiv.appendChild(profileImg);

            const username = document.createElement('div');
            username.textContent = request.from_user;
            requestDiv.appendChild(username);
            const acceptButton = document.createElement('button');
            acceptButton.textContent = 'Accept';
            acceptButton.addEventListener('click', () => {
                fetch(`http://127.0.0.1:8000/friendrequestaccepted/${request.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            });
            requestDiv.appendChild(acceptButton);

            const declineButton = document.createElement('button');
            declineButton.textContent = 'Decline';
            declineButton.addEventListener('click', () => {
                fetch(`http://127.0.0.1:8000/rejectfriendrequest/${request.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            });
            requestDiv.appendChild(declineButton);

            friendRequestsDiv.appendChild(requestDiv);
        });

    };

    const loadDashboard = () => {
        Promise.all([fetchPosts(), fetchUserProfile()])
            .then(([postsData, userProfileData]) => {
                renderPosts(postsData);
                renderUserProfile(userProfileData);
            })
            .catch(error => {
            });
    };

    loadDashboard();
    document.getElementById('notification-link').addEventListener('click', (event) => {
        event.preventDefault();
        edit_userprofile_data.style.display = 'none';
        messagesDiv.style.display = 'none';
        modal.style.display = 'none';
        addpostDiv.style.display = 'none';
        postsDiv.style.display = 'none';
        friendRequestsDiv.style.display = 'block';
        userProfileDiv.style.display = 'none';

        fetchFriendRequests()
            .then(data => {
                renderFriendRequests(data);
            })
            .catch(error => {

            });
    });

    document.getElementById('logout-link').addEventListener('click', (event) => {
        event.preventDefault();
        const refresh_token = localStorage.getItem('refresh');
        fetch('http://127.0.0.1:8000/logout/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh_token }),
        })
            .then(response => {

                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                localStorage.removeItem('username');
                localStorage.removeItem('user_id');
                window.location.replace('index.html');
            })
            .catch(error => {

            });
    });

    document.getElementById('userprofile').addEventListener('click', (event) => {
        event.preventDefault();
        edit_userprofile_data.style.display = 'none';
        modal.style.display = 'none';
        messagesDiv.style.display = 'none'
        addpostDiv.style.display = 'none';
        postsDiv.style.display = 'none';
        friendRequestsDiv.style.display = 'none';
        userProfileDiv.style.display = 'block';

        fetchPostsUser()
            .then(data => {
                renderUserPostsGrid(data);
            })
            .catch(error => {

            });
    });

    const renderUserPostsGrid = (data) => {
        
        const post_data = data.posts

        userProfileDiv.innerHTML = `<div class="row"><div class="col-md-5">${data.username.username}</div>
            <div class="col-md-7"><a href="#" id="edit-profile-link"><button type="button" class="btn btn-secondary btn-sm">Edit Profile</button></a>
            </div>
            </div>
            <div class="row">
            <div class="col-md-5 "><h2>User Posts</h2></div>
            <div class="col-md-7 ">
            <div class="col-md-6"><h2>${data.total_posts}</h2><p>Posts</p></div>
            <div class="col-md-6"><h2>${data.total_friends}</h2><p>Friends</p></div>
            </div>
            </div><br><br><br>`;

        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        gridContainer.style.gridGap = '10px';

        data.posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post-grid';

            if (post.post_images_videos && post.post_images_videos.length > 0) {
                const mediaElement = document.createElement('img');
                mediaElement.src = post.post_images_videos[0].file;
                mediaElement.alt = 'image';
                mediaElement.width = 100;
                mediaElement.height = 100;
                postDiv.appendChild(mediaElement);
                mediaElement.addEventListener('click', () => {

                    userProfileDiv.style.display = 'none';
                    const posts = document.getElementById('posts');
                    posts.style.display = 'block';
                    renderPosts(data.posts); 
                });
            }
            const contentParagraph = document.createElement('p');
            contentParagraph.textContent = post.content;
            postDiv.appendChild(contentParagraph);

            gridContainer.appendChild(postDiv);
        });

        userProfileDiv.appendChild(gridContainer);
        document.getElementById('edit-profile-link').addEventListener('click', async (event) => {
            event.preventDefault();
            const modal = document.querySelector('.modal'); 
            edit_userprofile_data.style.display = 'block';
            modal.style.display = 'none';
            messagesDiv.style.display = 'none';
            postsDiv.style.display = 'none';
            userProfileDiv.style.display = "none";
            friendRequestsDiv.style.display = 'none';
            addpostDiv.style.display = "none";

            edit_userprofile_data.innerHTML = `
                <section class="vh-100">
                    <div class="row d-flex justify-content-center align-items-center h-100">
                        <div class="col-lg-12 col-xl-11">
                            <div class="card text-black" style="border-radius: 22px;">
                                <div class="card-body p-md-5">
                                    <div class="row justify-content-center">
                                        <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                            <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Edit Profile</p>
                                            <form id="edit-userprofile-form" class="mx-1 mx-md-4" enctype="multipart/form-data">
                                                <div class="d-flex flex-row align-items-center mb-4">
                                                    <div class="form-outline flex-fill mb-0">
                                                    <input type="text" id="edit-first-name" class="form-control" placeholder="First Name"/>
                                                    </div>
                                                </div>
                                                <div class="d-flex flex-row align-items-center mb-4">
                                                    <div class="form-outline flex-fill mb-0">
                                                    <input type="text" id="edit-last-name" class="form-control" placeholder="Last Name"/>
                                                    </div>
                                                </div>
                                                <div class="d-flex flex-row align-items-center mb-4">
                                                    <div class="form-outline flex-fill mb-0">
                                                    <input type="email" id="edit-email" class="form-control" placeholder="Email"/>
                                                    </div>
                                                </div>
                                                <div class="d-flex flex-row align-items-center mb-4">
                                                    <div class="form-outline flex-fill mb-0">
                                                    <input type="text" id="edit-username" class="form-control" placeholder="Username"/>
                                                    </div>
                                                </div>
                                                <div class="d-flex flex-row align-items-center mb-4">
                                                    <div class="form-outline flex-fill mb-0">
                                                    <input type="file" id="edit-profile-img" class="form-control" accept="image/*"/>
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                    <button type="submit" class="btn btn-primary btn-lg">Update</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;

            try {
                const response = await fetch(`http://127.0.0.1:8000/userprofile/${user_id}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('edit-first-name').value = data.first_name;
                    document.getElementById('edit-last-name').value = data.last_name;
                    document.getElementById('edit-email').value = data.email;
                    document.getElementById('edit-username').value = data.username;

                } else {
                    console.error('Failed to fetch user profile data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user profile data:', error);
            }

            document.getElementById('edit-userprofile-form').addEventListener('submit', handleEditProfile);
        });

        const handleEditProfile = (event) => {
            event.preventDefault();
            const first_name = document.getElementById('edit-first-name').value;
            const last_name = document.getElementById('edit-last-name').value;
            const email = document.getElementById('edit-email').value;
            const username = document.getElementById('edit-username').value;
            const profile_img = document.getElementById('edit-profile-img').files[0];
            const formData = new FormData();
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);
            formData.append('email', email);
            formData.append('username', username);

            if (profile_img) {
                formData.append('profile_img', profile_img);
            }


            fetch(`http://127.0.0.1:8000/userprofile/${user_id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            })
            .then(response => {
                if (response.status === 200) {
                    alert('User Updated');
                    edit_userprofile_data.style.display = 'none';
                    postsDiv.style.display = 'block';
                    loadDashboard();
                } else {
                    return response.json().then(data => {
                        alert('User Not Updated: ' + data.message);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
        };
    };

    document.getElementById('addpost-link').addEventListener('click', (event) => {
        event.preventDefault();
        edit_userprofile_data.style.display = 'none';
        modal.style.display = 'none';
        messagesDiv.style.display = 'none'
        postsDiv.style.display = 'none';
        userProfileDiv.style.display = "none"
        friendRequestsDiv.style.display = 'none';
        addpostDiv.style.display = "block";
        addpostDiv.innerHTML = `
            <section class="vh-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-lg-12 col-xl-11">
                        <div class="card text-black" style="border-radius: 22px;">
                            <div class="card-body p-md-5">
                                <div class="row justify-content-center">
                                    <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Create Post</p>
                                        <form id="addpost-form" class="mx-1 mx-md-4" enctype="multipart/form-data">
                                            <div class="d-flex flex-row align-items-center mb-4">
                                                <div class="form-outline flex-fill mb-0">
                                                    <input type="text" id="content" class="form-control" placeholder="Content" required/>
                                                </div>
                                            </div>
                                            <div class="d-flex flex-row align-items-center mb-4">
                                                <div class="form-outline flex-fill mb-0">
                                                    <input type="file" id="files" name="files[]" class="form-control" accept="image/*" multiple />
                                                </div>
                                            </div>
                                            <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button type="submit" class="btn btn-primary btn-lg">Post</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        document.getElementById('addpost-form').addEventListener('submit', handlePost);
    });
    const handlePost = (event) => {
        event.preventDefault();
        const content = document.getElementById('content').value;
        const files = document.getElementById('files').files;
        const formData = new FormData();
        formData.append('content', content);
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        fetch('http://127.0.0.1:8000/addpost/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        })
            .then(response => {
                if (response.status === 201) {
                    alert('Post Created');
                } else {
                    return response.json().then(data => {
                        alert('Post not Created: ' + data.message);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
    };

    document.getElementById('message-link').addEventListener('click', (event) => {
        event.preventDefault();
        edit_userprofile_data.style.display = 'none';
        const messageDiv = document.getElementById('messages');
        const chatDiv = document.createElement('div');
        chatDiv.id = 'chatDiv';
        messageDiv.appendChild(chatDiv);
        modal.style.display = 'none';
        addpostDiv.style.display = 'none';
        friendRequestsDiv.style.display = 'none';
        userProfileDiv.style.display = 'none';
        postsDiv.style.display = 'none';
        messageDiv.style.display = 'block';
        messageDiv.innerHTML = '';

        fetchConversations()
            .then(data => {
                data.forEach(reciever => {
                    const conversation = `
                <div class="row">
                    <div class="col-md-4 chat-convesation">
                        <div class="form-outline mb-0">
                            <img src="${reciever.participants[0].profile_image}" alt="${reciever.conversation_name}" width="50px" height="50px" data-id="${reciever.participants[0].id}" data-conversation="${reciever.conversation_name}" class="profile-image">
                            ${reciever.participants[0].username}
                        </div>
                        <hr>
                    </div>
                    <div class="col-md-8 chatDiv" id="chatDiv" style="display: none;">
                        <div class="col-md-12 chat-message-Div" id="ChatMessageDiv">
                        </div>
                        <div class="col-md-12 chat-input-div" id="ChatInputDiv">
                            <input type="text" id="messageInput" name="messageInput">
                            <button id="sendMessageButton" type="button">Send</button>
                        </div>
                    </div>
                </div>

                `;
                    messageDiv.innerHTML += conversation;
                });

                document.querySelectorAll('.profile-image').forEach(img => {
                    img.addEventListener('click', (event) => {
                        const userId = event.target.getAttribute('data-id');
                        const conversationName = event.target.getAttribute('data-conversation');
                        openChat(userId, conversationName);
                    });
                });
            })

            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    });

    let currentSocket = null;

    function openChat(userId, conversationName) {
        const chatDiv = document.getElementById('chatDiv');
        chatDiv.style.display = 'block';
        const chatMessageDiv = document.getElementById('ChatMessageDiv');
        chatMessageDiv.innerHTML = '';

        fetch(`http://127.0.0.1:8000/conversation/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (currentSocket) {
                    currentSocket.close();
                }

                currentSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${conversationName}/?token=${token}`);
                currentSocket.onmessage = function (event) {
                    const data = JSON.parse(event.data);
                    const messages = Array.isArray(data) ? data : [data];
                    messages.forEach(message => {
                        const alignmentClass = message.sender === user_id ? 'message-right' : 'message-left';
                        const messageHTML = `
                        <div class="${alignmentClass}">
                            <strong>${message.sender}</strong>: ${message.text}
                        </div>
                    `;
                        chatMessageDiv.innerHTML += messageHTML;
                    });
                };


                currentSocket.onclose = function (event) {
                };

                currentSocket.onerror = function (error) {
                };

                const sendMessage = (content) => {
                    currentSocket.send(JSON.stringify(content));
                };

                document.getElementById('sendMessageButton').addEventListener('click', () => {
                    const messageContent = document.getElementById('messageInput').value;
                    sendMessage(messageContent);
                });
            })
            .catch(error => {
                console.error('Error fetching conversation:', error);
            });
    }

    document.getElementById('home-link').addEventListener('click', (event) => {
        event.preventDefault();
        edit_userprofile_data.style.display = 'none';
        modal.style.display = 'none';
        messagesDiv.style.display = 'none'
        addpostDiv.style.display = 'none';
        friendRequestsDiv.style.display = 'none';
        userProfileDiv.style.display = 'none';
        postsDiv.style.display = "block";
        loadDashboard()
    });
});
