
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
                    <li><a href="#" id="searchuser-link">Search</a></li>
                    <li><a href="#" id="message-link">Message</a><div id="notification-id" style="display:none"><i class="fa fa-bell float-right" id="notification-icon"></i></div></li>
                    <li><a href="#" id="friendrequest-link">Friend request</a></li>
                    <li><a href="#" id="userprofile-link">User profile</a></li>
                    <li><a href="#" id="logout-link">Logout</a></li>
                </ul>
            </div>
            <div class="col-md-10 posts-div" id="posts-div">
            </div>
            <div class="col-md-10 addpost-div" id="addpost-div" style="display: none;">
            </div>
            <div class="col-md-10 messages-div" id="messages-div" style="display: none;">
                <div class="row">
                    <div class="col-md-4 chat-convesation-div" id="chat-convesation-div">
                    </div>
                    <div class="col-md-8 chat-div" id="chat-div" style="display: none;">
                        <div class="col-md-12 chat-message-Div" id="ChatMessageDiv">
                        </div>
                        <div class="col-md-12 chat-input-div" id="ChatInputDiv">
                            <br/>
                            <input type="text" id="messageInput" style="width:90%" name="messageInput">
                            <button id="sendMessageButton" type="button">Send</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-10 friend-requests-div" id="friend-requests-div" style="display: none;">
            </div>
            <div class="col-md-10 userprofile-detail-div" id="userprofile-detail-div" style="display: none;">
            </div>
            <div class="col-md-10 edit-userprofile-div" id="edit-userprofile-div" style="display: none;">
            </div>
            <div class="col-md-10 user-search-div" id="user-search-div" style="display: none;">
                <input type="text" class="col-sm-6 form-control" id="searchUser" name="searchUser" placeholder="Search">
                <br/><br/>
                <div id="search-result-div">
                </div>
            </div>
        </div>
    </div>
    `;

    const token = localStorage.getItem('access');
    const user_id = localStorage.getItem('user_id');
    const login_username = localStorage.getItem('username')
    const posts_div = document.getElementById('posts-div');
    const friend_requests_div = document.getElementById('friend-requests-div');
    const edit_userprofile_div = document.getElementById('edit-userprofile-div');
    const userprofile_detail_div = document.getElementById('userprofile-detail-div');
    const addpost_div = document.getElementById('addpost-div');
    const user_search_div = document.getElementById('user-search-div');
    const search_result_div = document.getElementById('search-result-div');
    const messages_div = document.getElementById('messages-div');
    const search_input = document.getElementById('searchUser');
    const post_comment_div = document.getElementById('post-comment-div');
    const chat_conversation_div = document.getElementById('chat-convesation-div');
    const chat_div = document.getElementById('chat-div');
    const modal = document.getElementById('commentModal');
    const span = document.getElementsByClassName('close')[0];
    const submit_comment_button = document.getElementById('submitComment');

    
    
    function toggleDisplay(elementToShow) {
        const elements = [
            edit_userprofile_div,
            messages_div,
            modal,
            addpost_div,
            user_search_div,
            posts_div,
            friend_requests_div,
            userprofile_detail_div
        ];

        elements.forEach(elementId => {
            if (elementToShow == elementId){
                elementToShow.style.display = 'block';    
            }else{
                elementId.style.display = 'none';
            }
        });       
    }

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
            alert('There was a problem with the fetch operation:', error);
        }
    };

    const fetchSearchUser = (userId) => {
        return fetch(`http://127.0.0.1:8000/post/${userId}`, {
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
        })
        .catch(error => {
            alert('Error posting comment:', error);
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
        posts_div.innerHTML = '';
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
                        alert('Error liking post:', error);
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
            posts_div.appendChild(postDiv);
        });
    };

    function openModal(postID, postcomments) {
        const comments = Array.isArray(postcomments) ? postcomments : [postcomments]; 
        post_comment_div.innerHTML = ''
        comments.forEach(comment => {
            const commentHtml = `
                    <div class="DivComment">
                        ${comment.content}
                    </div>
                `;
            post_comment_div.innerHTML += commentHtml;
        });
        submit_comment_button.setAttribute('data-postid', postID);
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

    submit_comment_button.addEventListener('click', () => {
        const commentInput = document.getElementById('commentInput');
        const commentText = commentInput.value;
        const postID = submit_comment_button.getAttribute('data-postid');
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
                alert('Error posting comment:', error);
            });
        }
    });

    const renderFriendRequests = (data) => {
        friend_requests_div.innerHTML = '';
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
                .then(response => {
                    if (response.status === 201) {
                        fetchFriendRequests()
                        .then(data => {
                            renderFriendRequests(data);
                        })
                        .catch(error => {
                        });
                    }
                    return response.json();
                });
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
                .then(response => {
                    if (response.status === 201) {
                        fetchFriendRequests()
                        .then(data => {
                            renderFriendRequests(data);
                        })
                        .catch(error => {
                        });
                    }
                    return response.json();
                });
                
            });
            requestDiv.appendChild(declineButton);

            friend_requests_div.appendChild(requestDiv);
        });

    };
    document.getElementById('friendrequest-link').addEventListener('click', (event) => {
        event.preventDefault(); 
        toggleDisplay(friend_requests_div);
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

    const renderUserPosts = (data) => {    
        let editProfileButton = '';
        if (login_username === data.username.username) {
            editProfileButton = `<a href="#" id="edit-profile-link"><button type="button" class="btn btn-secondary btn-sm">Edit Profile</button></a>`;
        }
    
        userprofile_detail_div.innerHTML = `<div class="row"><div class="col-md-5">${data.username.username}</div>
            <div class="col-md-7">${editProfileButton}</div>
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
                    userprofile_detail_div.style.display = 'none';
                    posts_div.style.display = 'block';
                    renderPosts(data.posts);
                });
            }
            const contentParagraph = document.createElement('p');
            contentParagraph.textContent = post.content;
            postDiv.appendChild(contentParagraph);
    
            gridContainer.appendChild(postDiv);
        });
        userprofile_detail_div.appendChild(gridContainer);
    
        if (login_username === data.username.username) {
            document.getElementById('edit-profile-link').addEventListener('click', async (event) => {
                event.preventDefault();
                toggleDisplay(edit_userprofile_div)
                edit_userprofile_div.innerHTML = `
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
                                                            <input type="text" id="edit-first-name" class="form-control" placeholder="First Name" required/>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="text" id="edit-last-name" class="form-control" placeholder="Last Name" required/>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="email" id="edit-email" class="form-control" placeholder="Email" required/>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="text" id="edit-username" class="form-control" placeholder="Username" required/>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="file" id="edit-profile-img" class="form-control" accept="image/*" required/>
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
                        alert('Failed to fetch user profile data:', response.statusText);
                    }
                } catch (error) {
                    alert('Error fetching user profile data:', error);
                }
    
                document.getElementById('edit-userprofile-form').addEventListener('submit', handleEditProfile);
            });
        }

        const showErrorMessage = (field, message) => {
            // Remove existing error message
            const existingError = field.nextElementSibling;
            if (existingError && existingError.classList.contains('error-message')) {
                existingError.remove();
            }
            // Create a new error message
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.style.color = 'red';
            errorSpan.textContent = message;
            field.parentNode.insertBefore(errorSpan, field.nextSibling);
        };
        
        const validateFields = () => {
            let isValid = true;
            const fieldsToValidate = [
                { id: 'edit-first-name', message: 'First name is required' },
                { id: 'edit-last-name', message: 'Last name is required' },
                { id: 'edit-email', message: 'Email is required' },
                { id: 'edit-username', message: 'Username is required' }
            ];
        
            fieldsToValidate.forEach(fieldInfo => {
                const field = document.getElementById(fieldInfo.id);
                if (!field.value.trim()) {
                    showErrorMessage(field, fieldInfo.message);
                    isValid = false;
                }
            });
        
            return isValid;
        };


        const handleEditProfile = (event) => {
            event.preventDefault();
            if (!validateFields()) {
                return;
            }
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
                    edit_userprofile_div.style.display = 'none';
                    posts_div.style.display = 'block';
                    loadDashboard();
                } else {
                    return response.json().then(data => {
                        alert('User Not Updated: ' + data.message);
                    });
                }
            })
            .catch(error => alert('User Not Updated: ' + error));
        };
    };
    search_input.addEventListener('input', onSearch);

    async function onSearch() {
        const searchInputValue = search_input.value;
        if (searchInputValue.trim() === '') {
            search_result_div.innerHTML = ''; 
            return;
        }
        try {
            const response = await fetch(`http://127.0.0.1:8000/searchuser/?search=${searchInputValue}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            alert('There has been a problem with your fetch operation:', error);
        }
    }

    function displayResults(data) {
        search_result_div.innerHTML = ''; 
        if (data.length === 0) {
            search_result_div.innerHTML = '<p>No results found</p>';
            return;
        }
        data.forEach(user => {
            let buttonHTML;
            if (user.friend_request === "accepted") {
                buttonHTML = `<button class="btn btn-danger unfollow-button" data-id="${user.id}">Unfollow</button>`;
            } else if (user.friend_request === "requested") {
                buttonHTML = `<button class="btn btn-secondary requested-button" data-id="${user.id}">Requested</button>`;
            } else {
                buttonHTML = `<button class="btn btn-success follow-button" data-id="${user.id}">Follow</button>`;
            }
            const listItem = `
            <div class="form-outline mb-0 user-${user.username}">
                <img src="${user.profile_img}" alt="${user.username}" width="50px" height="50px" data-id="${user.id}" class="profile-image">
                ${user.username}<br/>
                <button class="btn btn-secondary message-button" data-id="${user.id}">Message<i class="fa fa-comments-o" style="font-size:20px"></i></button>
                ${buttonHTML}
            </div><br/>
            `;
            search_result_div.innerHTML += listItem;
        });
        const profileImages = document.querySelectorAll('.profile-image');
        profileImages.forEach(image => {
            image.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                toggleDisplay(userprofile_detail_div)
                userprofile_detail_div.style.display = 'block';
                fetchSearchUser(userId)
                .then(data => {
                    renderUserPosts(data);
                })
                .catch(error => {
                    alert('There has been a problem with your fetch operation:', error)
                });
            });
        });    

        search_result_div.addEventListener('click', (event) => {
            if (event.target.classList.contains('message-button')) {
                const userId = event.target.getAttribute('data-id');
                toggleDisplay(messages_div)
                openChat(userId)
            }
        });
        
        search_result_div.addEventListener('click', (event) => {
            if (event.target.classList.contains('follow-button')) {
                const userId = event.target.getAttribute('data-id');
                
                fetch(`http://127.0.0.1:8000/friendrequestsend/${userId}`, {
                    method: 'GET', 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.status === 201) {
                        fetchFriendRequests()
                        .then(data => {
                            renderFriendRequests(data);
                        })
                        .catch(error => {
                        });
                    }

                    return response.json();
                })
                .catch(error => {
                    alert('There has been a problem with your fetch operation:', error);
                });
            }
        });

        search_result_div.addEventListener('click', (event) => {
            if (event.target.classList.contains('unfollow-button')) {
                const userId = event.target.getAttribute('data-id');
                fetch(`http://127.0.0.1:8000/unfollowfriendrequest/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    return response.json();
                })
                .catch(error => {
                    alert('There has been a problem with your fetch operation:', error);
                });
            }
        });
    }
    document.getElementById('addpost-link').addEventListener('click', (event) => {
        event.preventDefault();
        toggleDisplay(addpost_div)
        addpost_div.innerHTML = `
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
                                                    <input type="file" id="files" name="files[]" class="form-control" accept="image/*" multiple required/>
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
                console.log()
                if (response.status === 201) {
                    alert('Post Created');
                    toggleDisplay(posts_div)
                    loadDashboard()
                } else {
                    return response.json().then(data => {
                        alert('Post not Created: ' + data.message);
                    });
                }
            })
            .catch(error => alert('Post not Created: ' + error));
    };
    
    document.getElementById('searchuser-link').addEventListener('click', (event) => {
        event.preventDefault();
        toggleDisplay(user_search_div)
    })
    document.getElementById('message-link').addEventListener('click', (event) => {
        event.preventDefault();
    
        toggleDisplay(messages_div);
        chat_div.style.display = 'none';
        chat_conversation_div.style.display = 'block';
        chat_conversation_div.innerHTML = '';
    
        fetchConversations()
            .then(data => {
                data.forEach(reciever => {
                    const conversation = `
                    <div class="form-outline mb-0 chats">
                        <img src="${reciever.participants[0].profile_image}" alt="${reciever.conversation_name}" width="50px" height="50px" data-id="${reciever.participants[0].id}" class="profile-image">
                        ${reciever.participants[0].username}<div id="notification-${reciever.conversation_name}-id" style="display:none"><i class="fa fa-bell float-right" id="notification-${reciever.conversation_name}-icon"></i></div>
                    </div>
                    <hr>
                    `;
                    chat_conversation_div.innerHTML += conversation;
                    setupWebSocket(reciever.conversation_name);
                });
    
                document.querySelectorAll('.profile-image').forEach(img => {
                    img.addEventListener('click', (event) => {
                        const userId = event.target.getAttribute('data-id');
                        openChat(userId);
                    });
                });
            })
            .catch(error => {
                alert('Error fetching posts:', error);
            });
    
        function setupWebSocket(conversation_name) {
            let currentSocket = new WebSocket(`ws://127.0.0.1:8000/ws/notification/reciever/${conversation_name}/?token=${token}`);
    
            currentSocket.onmessage = function (event) {
                const data = JSON.parse(event.data);
                console.log(conversation_name, data);
                if (data.count != 0) {
                    console.log(conversation_name, data.count);
                    handleuserNotification(data, conversation_name);
                }
            };
    
            currentSocket.onclose = function (event) {
                console.log('WebSocket closed:', event);
                // Attempt to reconnect after a delay
                setTimeout(() => setupWebSocket(conversation_name), 1000);
            };
    
            currentSocket.onerror = function (error) {
                console.error('WebSocket error:', error);
            };
    
            // Send a ping message every 30 seconds to keep the connection alive
            setInterval(() => {
                if (currentSocket.readyState === WebSocket.OPEN) {
                    currentSocket.send(JSON.stringify({ type: 'ping' }));
                }
            }, 30000);
        }
    
        function handleuserNotification(data, conversation_name) {
            const notification_id = document.getElementById(`notification-${conversation_name}-id`);
            console.log("ddsfdfeferefesderfedcd",data)
            if (data.count != 0) {
                notification_id.style.display = "block";
                let notification_icon = document.getElementById(`notification-${conversation_name}-icon`);
                notification_icon.textContent = data.count;
            } else {
                notification_id.style.display = "none";
                console.log('Notification element not found');
            }
        }
    });
    

    let currentSocket = null; 
    let sendMessageButtonListenerAdded = false;

    function openChat(userId) {
        chat_div.style.display = 'block';
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
            currentSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${data.conversation_name.conversation_name}/?token=${token}`);
            currentSocket.onmessage = function (event) {
                const data = JSON.parse(event.data);
                const messages = Array.isArray(data) ? data : [data];
                messages.forEach(message => {
                    const alignmentClass = message.sender_username === login_username ? 'message-right' : 'message-left';
                    
                    const messageHTML = `
                        <div class="${alignmentClass}">
                            <strong>${message.sender_username}</strong>: ${message.text}
                        </div>
                    `;
                    chatMessageDiv.innerHTML += messageHTML;
                });
            };
            currentSocket.onclose = function (event) {
                console.log('WebSocket closed:', event);
            };
            currentSocket.onerror = function (error) {
                alert('WebSocket error:', error);
            };
            const sendMessage = (content) => {
                if (currentSocket && currentSocket.readyState === WebSocket.OPEN) {
                    currentSocket.send(JSON.stringify(content));
                }
            };
            if (!sendMessageButtonListenerAdded) {
                document.getElementById('sendMessageButton').addEventListener('click', () => {
                    const messageContent = document.getElementById('messageInput').value;

                    sendMessage(messageContent);
                    document.getElementById('messageInput').value = '';
                });
                sendMessageButtonListenerAdded = true;
            }
        })
        .catch(error => {
            alert('Error fetching conversation: ' + error);
        });
    }
    
    document.getElementById('userprofile-link').addEventListener('click', (event) => {
        event.preventDefault();
        toggleDisplay(userprofile_detail_div)
        fetchSearchUser(user_id)
        .then(data => {
            renderUserPosts(data);
        })
        .catch(error => {
            alert('There has been a problem with your fetch operation:', error)
        });
    })


    const loadDashboard = () => {
        fetchPosts()
            .then(postsData => {
                renderPosts(postsData);
            })
            .catch(error => {
                alert("dashboard not reload",)
            });
    };
    loadDashboard();

    document.getElementById('home-link').addEventListener('click', (event) => {
        event.preventDefault();
        toggleDisplay(posts_div)
        loadDashboard()
    });

    function initializeWebSocket(username) {
        const currentSocket = new WebSocket(`ws://127.0.0.1:8000/ws/notification/${username}/`);
        
        currentSocket.onmessage = function (event) {
            const data = JSON.parse(event.data);
            handleNotification(data);
        };

        currentSocket.onclose = function (event) {
            console.log('WebSocket closed:', event);
            setTimeout(() => {
                initializeWebSocket(username);
            }, 5000);
        };

        currentSocket.onerror = function (error) {
            console.error('WebSocket error:', error);
        };

        return currentSocket;
    }

    function handleNotification(data) {
        console.log(data)
        const notification_id = document.getElementById('notification-id');
        if (data.count != 0) {
            notification_id.style.display="block"
            let notification_icon = document.getElementById('notification-icon');
            notification_icon.textContent = data.count;
        } else {
            notification_id.style.display="none"
            console.log('Notification element not found');
        }
    }
    initializeWebSocket(login_username);
        
});