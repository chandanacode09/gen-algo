import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Algorithm Visualization Library';
  isDarkMode = false;

  ngOnInit(): void {
    try {
      // Check for saved theme preference or default to light mode
      const savedTheme = localStorage?.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme();
    } catch (error) {
      console.warn('LocalStorage not available:', error);
      this.applyTheme();
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    try {
      localStorage?.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Could not save theme preference:', error);
    }
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }
}
