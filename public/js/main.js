document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const showAddBookBtn = document.getElementById("showAddBookBtn");
  const addBookContainer = document.getElementById("addBookContainer");

  showAddBookBtn.addEventListener("click", () => {
    addBookContainer.classList.toggle("visible");
  });

  searchInput.addEventListener("keyup", searchBooks);

  function searchBooks() {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll("#booksContainer .book").forEach((book) => {
      const text = book.textContent.toLowerCase();
      book.style.display = text.includes(query) ? "" : "none";
    });
  }

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const form = btn.closest("form");
      form.classList.add("editing");

      // remember current values so Cancel can restore them
      form.querySelectorAll(".edit").forEach((field) => {
        field.dataset.original = field.value;
        field.disabled = false;
      });

      btn.hidden = true;
      form.querySelector(".delete-btn").hidden = true; 
      form.querySelector(".cancel-btn").hidden = false;
      form.querySelector(".save-btn").hidden = false;
    });
  });

  document.querySelectorAll(".cancel-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const form = btn.closest("form");

      form.querySelectorAll(".edit").forEach((field) => {
        field.value = field.dataset.original ?? field.value;
        field.disabled = true;
      });

      form.classList.remove("editing");
      btn.hidden = true;
      form.querySelector(".save-btn").hidden = true;
      form.querySelector(".delete-btn").hidden = true; 
      form.querySelector(".edit-btn").hidden = false;
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const form = btn.closest("form");
      if (confirm("Are you sure you want to delete this book?")) {
        form.action = "/delete-book";
        form.submit();
      }
    });
  });
});