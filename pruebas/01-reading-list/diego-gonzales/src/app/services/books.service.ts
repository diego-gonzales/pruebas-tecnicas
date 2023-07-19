import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import type { Book, BooksData } from '~/interfaces/books.interface';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private _httpClient = inject(HttpClient);
  private _bookList = signal<Book[]>([]);
  private _readingList = signal<Book[]>([]);
  totalBooksAvailable = computed(
    () => this._bookList().length - this._readingList().length
  );
  totalBooksInReadingList = computed(() => this._readingList().length);
  showSearchBox = signal<boolean>(false);

  get bookList() {
    return this._bookList.asReadonly();
  }

  get readingList() {
    return this._readingList.asReadonly();
  }

  getBooks() {
    this._httpClient
      .get<BooksData>('assets/data.json')
      .pipe(map((resp) => resp.library.map((item) => item.book)))
      .subscribe((resp) => this._bookList.set(resp));
  }

  getBook(ISBN: string) {
    return this._httpClient.get<BooksData>('assets/data.json').pipe(
      map((resp) => resp.library.map((item) => item.book)),
      map((resp) => resp.find((book) => book.ISBN === ISBN) ?? null)
    );
  }

  updateReadingList(book: Book) {
    this._bookList.mutate((value) => {
      const bookIndex = value.findIndex((b) => b.ISBN === book.ISBN);
      const favoriteValue = book.isFavorite ?? false;

      value[bookIndex].isFavorite = !favoriteValue;
    });

    this._readingList.mutate((value) => {
      const bookIndex = value.findIndex((b) => b.ISBN === book.ISBN);
      bookIndex === -1 ? value.unshift(book) : value.splice(bookIndex, 1);
    });
  }
}