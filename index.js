console.log("getPosts", getPosts);

let fullname;
let avatar;

// let currentPost = {};

const work = () => {
  const panelEl = $("#panel");

  fullname = prompt("Zehmet olmasa mutleq adinizi yazin");
  avatar = prompt("Zehmet olmasa avatar seklinizi qoyun");

  if (!fullname.trim()) {
    alert("Adinizi yazmadiginiza gore sisteme daxil olmur!");
    return;
  }

  panelEl.removeClass("d-none");
  renderPosts();
};

async function renderPosts() {
  try {
    const postsEl = $("#posts");
    const data = await getPosts();

    const content = data.reverse().map((post) => {
      const createdTime = convertTime(post.created);

      return `
    <div class="card shadow">
    <img
      src="data:image/png;base64,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"
      class="card-img-top"
      style="object-fit: cover"
      height="300"
      alt="${post.title}"
    />
    <div class="card-body">
      <h5 class="card-title">${post.title}</h5>
      <p class="card-text">
      ${post.body}
      </p>
      <h6 class="card-subtitle mt-4 mb-3 text-muted">${createdTime}</h6>
      <div class="d-flex align-items-center gap-2">
        <img
          class="rounded-circle shadow"
          width="50"
          height="50"
          style="object-fit: cover"
          src="${
            post.avatar
              ? post.avatar
              : "https://img.myloview.com/stickers/default-avatar-profile-icon-vector-social-media-user-image-700-205124837.jpg"
          }"
        />
        <p class="h6">${
          post.fullname ? post.fullname : "Anonim"
        }</p> <button class="btn btn-danger remove-btn" value="${
        post.id
      }">DEL </button>
      </div>
    </div>
  </div>
    `;
    });

    postsEl.html(content);
  } catch (err) {
    console.log("err", err);

    console.log("Network error");
  }
}

$(document).on("click", "#shareBtn", async function () {
  try {
    const title = $("#postInput").val().trim();
    const body = $("#postBodyInput").val().trim();

    const newPostData = {
      title,
      body,
      fullname,
      avatar,
      created: new Date(),
    };

    console.log("newPostData", newPostData);

    await addPost(newPostData);

    renderPosts();

    $("#postInput").val("");
    $("#postBodyInput").val("");
  } catch (err) {
    console.log("er", err);
  }
});

$(document).on("click", ".remove-btn", async function () {
  try {
    const id = $(this).val();
    console.log("id", id);

    await rmvPost(id);

    renderPosts();
  } catch (err) {}
});

work();
