const delay = (ms) => new Promise((res) => res(true));
const errorConstant = "__";
const errorMsg = `Kesalahan : ${errorConstant} , silahan hubungi developer!`;
const inputBookForm = document.getElementById("bookForm");
const clearParent = () => {
  const parent1 = document.getElementById("incompleteBookshelfList");
  const parent2 = document.getElementById("completeBookshelfList");

  if (parent1) {
    parent1.innerHTML = "";
  }

  if (parent2) {
    parent2.innerHTML = "";
  }
};

const setLocalStorage = (id, value) => {
  if (!id) {
    return null;
  } else if (value === undefined) {
    return JSON.parse(localStorage.getItem(id));
  } else if (value) {
    value = JSON.stringify(value);
    localStorage.setItem(id, value);
    return setLocalStorage(id);
  } else {
    localStorage.removeItem(id);
  }
};

const loadBook = (book) => {
  // cek apakah bukunya kosong
  if (!book) {
    alert(errorMsg.replace(errorConstant, "buku tidak termuat"));
    return;
  }

  // cek isComplete untuk menentukan elemen parent mana yang akan diisi
  let classTarget = document?.getElementById("incompleteBookshelfList");
  if (book.isComplete === true) {
    classTarget = document?.getElementById("completeBookshelfList");
  }

  // cek kembali jika classTarget tidak ditemukan (semisal typo di html)
  if (!classTarget) {
    alert(errorMsg.replace(errorConstant, "ketika memuat buku"));
    return;
  }

  // console.log(book);
  // mengisi element target dari classTarget dengan data yang sudah ditambahkan
  let newHTML = `<article id="${book.id}" class="book_item">
  <h3>${book.title}</h3>
  <p>Penulis: ${book.author}</p>
  <p>Tahun: ${book.year}</p>

  <div class="action">
    `;
  newHTML += `${
    !book.isComplete
      ? '<button onclick="onCompleteBtn(this)" class="green">Selesai dibaca</button>'
      : '<button onclick="onUnCompleteBtn(this)" class="green">Tandai belum dibaca</button>'
  }`;

  newHTML += ` <button onclick="onDeleteBtn(this)" class="red">Hapus buku</button> </div> </article>`;

  // supaya waktu render html baru dengan style.css itu sama
  classTarget.innerHTML += newHTML;
};

const loadBooks = () => {
  clearParent();

  for (const key in localStorage) {
    // cek jika key yang ditemukan memang benar ada
    if (setLocalStorage(key)) {
      // data yang ada diambil ulang berdasarkan key yang sudah valid, kemudian di parsing menjadi object kembali
      loadBook(setLocalStorage(key));
    }
  }
};

async function onCompleteBtn(el) {
  const targetId = el?.parentElement?.parentElement?.getAttribute("id");
  if (!targetId) {
    alert(errorMsg.replace(errorConstant, "ketika mengubah status buku"));
    return;
  }

  const book = setLocalStorage(targetId);

  if (!book) {
    alert(errorMsg.replace(errorConstant, "buku tidak ditemukan"));
    return;
  }

  book.isComplete = true;
  setLocalStorage(targetId, book);
  // load semua buku dengan menghapus isi dari data-row html
  loadBooks();
  // dikasih pemberitahuan ke user
  await delay(1000);
  alert(
    `Buku dengan judul ${book.title} oleh ${book.author} berhasil ditandai telah dibaca `
  );
}

async function onUnCompleteBtn(el) {
  const targetId = el?.parentElement?.parentElement?.getAttribute("id");
  if (!targetId) {
    alert(errorMsg.replace(errorConstant, "ketika mengubah status buku"));
    return;
  }

  const book = setLocalStorage(targetId);

  if (!book) {
    alert(errorMsg.replace(errorConstant, "buku tidak ditemukan"));
    return;
  }

  book.isComplete = false;
  setLocalStorage(targetId, book);
  // load semua buku dengan menghapus isi dari data-row html
  loadBooks();
  // dikasih pemberitahuan ke user
  await delay(1000);
  alert(
    `Buku dengan judul ${book.title} oleh ${book.author} berhasil ditandai belum dibaca `
  );
}

async function onDeleteBtn(el) {
  const targetId = el?.parentElement?.parentElement?.getAttribute("id");
  if (!targetId) {
    alert(errorMsg.replace(errorConstant, "ketika menghapus buku"));
    return;
  }

  const book = setLocalStorage(targetId);

  if (!book) {
    alert(errorMsg.replace(errorConstant, "buku tidak ditemukan"));
    return;
  }
  // hapus buku
  setLocalStorage(targetId, null);
  // load semua buku dengan menghapus isi dari data-row html
  loadBooks();
  // dikasih pemberitahuan ke user
  await delay(1000);
  alert(
    `Buku dengan judul ${book.title} oleh ${book.author} berhasil dihapus `
  );
}

// submit buku
inputBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const date = document.getElementById("date");
  const isComplete = document.getElementById("isComplete");

  // validasi
  if (!title?.value || !author?.value || !date?.value) {
    alert("Pastikan kolom judul, penulis dan tahun sudah diiisi!");
    return;
  }

  // buat object buku
  let newBook = {
    id: new Date().getTime(),
    title: title.value,
    author: author.value,
    year: date.value,
    isComplete: isComplete?.checked || false,
  };

  // simpan ke local storage dengan membuat object menjadi string
  // (karena localstorage simpan data sebagai string)
  setLocalStorage(newBook.id, newBook);

  // console.log(localStorage.length); asumsi nambah 1
  // load data buku kembali
  loadBook(newBook);
  // dikasih pemberitahuan ke user
  alert(
    `Buku baru dengan judul ${newBook.title} oleh ${newBook.author} berhasil ditambahkan `
  );
});

// load website -> load data dari localstorage
document.addEventListener("DOMContentLoaded", (event) => {
  // looping semua data yang ada di localstorage
  loadBooks();
});

// opsional

const searchBook = document.getElementById("searchBook");

searchBook.addEventListener("submit", (event) => {
  event.preventDefault();
  const term = document.getElementById("searchBookTitle");

  if (!term.value) {
    loadBooks();
    return;
  }

  let res = [];
  for (const key in localStorage) {
    // cek jika key yang ditemukan memang benar ada
    const book = setLocalStorage(key);
    if (book && String(book.title).includes(term.value)) {
      //   console.log(book, String(book.title));
      res.push(book);
    }
  }

  if (!res) {
    return;
  }

  clearParent();
  res?.forEach((el) => {
    loadBook(el);
  });
});
