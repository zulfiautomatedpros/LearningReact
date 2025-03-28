const processUserData = (users) => {
    const activeUsers = users.filter(user => user.isActive);
    const transformedUsers = activeUsers.map(({ id, firstName, lastName, email }) => ({
      id,
      fullName: `${firstName} ${lastName}`,
      email,
    }));
    return transformedUsers.sort((a, b) => a.fullName.localeCompare(b.fullName));
  };
  
  const fetchUserPosts = async (userId) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      const posts = await response.json();
      return posts.map(post => post.title);
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
      throw error;
    }
  };
  
  const createUserProfileHTML = (user) => {
    const activeBadge = user.isActive ? `<span class="badge active">Active</span>` : "";
    return `
      <div class="user-card" id="user-${user.id}">
        <img src="${user.avatar}" alt="${user.firstName} ${user.lastName}" class="avatar" />
        <div class="user-info">
          <h2>${user.firstName} ${user.lastName}</h2>
          <p>Email: ${user.email}</p>
          <p>Role: ${user.role || "User"}</p>
          ${activeBadge}
        </div>
      </div>
    `;
  };
  
  const createStateManager = (initialState) => {
    let state = { ...initialState };
    const subscribers = [];
    return {
      getState: () => state,
      setState: (newState) => {
        state = { ...state, ...newState };
        subscribers.forEach(callback => callback(state));
      },
      subscribe: (callback) => {
        subscribers.push(callback);
      }
    };
  };
  
  const users = [
    { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", isActive: true },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", isActive: false },
    { id: 3, firstName: "Bob", lastName: "Johnson", email: "bob@example.com", isActive: true },
    { id: 4, firstName: "Sara", lastName: "Williams", email: "sara@example.com", isActive: true },
    { id: 5, firstName: "Zulkifal", lastName: "Shah", email: "qa6fds3@example.com", isActive: true },
  ];
  
  const processedUsers = processUserData(users);
  console.log("Processed Users:", processedUsers);
  document.getElementById("processedUsers").innerText =
    "Processed Users: " + JSON.stringify(processedUsers, null, 2);
  
  fetchUserPosts(1)
    .then(titles => {
      console.log("User Posts:", titles);
      document.getElementById("userPosts").innerText =
        "User Posts: " + JSON.stringify(titles, null, 2);
    })
    .catch(error => {
      console.error("Error fetching posts:", error);
      document.getElementById("userPosts").innerText =
        "Error fetching posts: " + error;
    });
  
  const sampleUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    isActive: true,
    role: "Admin",
  };
  
  const userProfileHTML = createUserProfileHTML(sampleUser);
  console.log("User Profile HTML:", userProfileHTML);
  document.getElementById("userProfile").innerHTML = userProfileHTML;
  
  const userState = createStateManager({ name: "John", online: false });
  userState.subscribe(state => {
    console.log("State changed:", state);
    document.getElementById("stateOutput").innerText =
      "State changed: " + JSON.stringify(state, null, 2);
  });
  console.log("Initial State:", userState.getState());
  document.getElementById("stateOutput").innerText =
    "Initial State: " + JSON.stringify(userState.getState(), null, 2);
  userState.setState({ online: true });
  userState.setState({ lastActive: "2023-05-01" });
  userState.setState({ name: "Jane" });
  