import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyInterestsComponent } from './my-interests/my-interests.component';
import { AboutComponent } from './about/about.component';
import { ChessboardComponent } from './chess/chessboard/chessboard.component';
import { RecommendBooksComponent } from './recommend-books/recommend-books.component';
import { CreateGameComponent } from './chess/create-game/create-game.component';
import { ChessComponent } from './chess/chess.component';


const routes: Routes = [
  { path: 'interests', component: MyInterestsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'chess', component: ChessComponent },
  { path: 'recommend-books', component: RecommendBooksComponent },
  { path: '', redirectTo: '/about', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }