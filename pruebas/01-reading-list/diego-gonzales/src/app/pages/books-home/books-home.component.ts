import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import BookListComponent from '~/components/book-list/book-list.component';
import { BookFiltersComponent } from '~/components/book-filters/book-filters.component';
import { ReadingListComponent } from '~/components/reading-list/reading-list.component';
import { BooksService } from '~/services/books.service';

@Component({
  selector: 'app-books-home',
  standalone: true,
  imports: [
    CommonModule,
    BookListComponent,
    ReadingListComponent,
    BookFiltersComponent,
  ],
  templateUrl: './books-home.component.html',
})
export default class BooksHomeComponent {
  private _booksService = inject(BooksService);
  totalBooksAvailable = this._booksService.totalBooksAvailable;
  totalBooksInReadingList = this._booksService.totalBooksInReadingList;

  bookMapping = {
    '=0': 'No books',
    '=1': '1 book',
    other: '# books',
  };

  constructor() {
    this._booksService.showSearchBox.set(true);
  }

  ngOnDestroy(): void {
    this._booksService.showSearchBox.set(false);
  }
}