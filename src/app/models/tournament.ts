export interface Tournament {
  TournamentID: number;
  Name: string;
  StartDate: string;
  EndDate: string;
  IsOver: boolean;
  IsInProgress: boolean;
  Venue: string;
  Location: string;
  Par: number;
  Yards: number;
  Purse: number;
  StartDateTime: string;
  Canceled: boolean;
  City: string;
  State: string;
  Country: string;
}
