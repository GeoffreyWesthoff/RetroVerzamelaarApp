import { Collectable } from "./collected-game-dto";

export class CreateUserDto {
  constructor(username, password_hash) {this.password_hash = password_hash, this.username=username};
  readonly username: string;
  readonly password_hash: string;

  readonly owned_consoles: Collectable[];
  readonly owned_games: Collectable[];
  
  readonly admin: boolean = false;
  }
  
export class SignUpBody {
  readonly username: string;
  readonly password: string;
  readonly password_confirm: string;
}

export class EditUserDto {
  readonly username: string;
  readonly password: string;
  readonly current_password: string;
  readonly password_confirm: string;
}

export class EditUserAdminDto {
  readonly username: string;
  readonly password: string;
  readonly password_confirm: string;
  readonly owned_consoles: [];
  readonly owned_games: [];
  readonly admin: boolean = false;
}

export class DeleteSelfBody {
  readonly current_password: string;
}

export class UserPartial {
  readonly username: string;
}