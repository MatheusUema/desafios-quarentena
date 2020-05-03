const playerTotalHp = 274;
let playerHp = 274;


const opponentTotalHp = 292; //292
let opponentHp = 292;


let isTurnHappening = false;

let roundCount = 0;

//Definição de variaveis do index
const turnText = document.getElementById('text');
const opponentName = document.getElementById("opponent-name").innerHTML;
const opponentLevel = document.getElementById("opponent-level").innerHTML;
const playerName = document.getElementById("player-name").innerHTML;
const playerLevel = document.getElementById("player-level").innerHTML;
const playerHpElement = document.getElementById("player-health");
const opponentHpElement = document.getElementById('opponent-health');
const playerExpElement = document.getElementById('player-exp');
const opponentExpElement = document.getElementById('opponent-exp');
const pikachuImage = document.getElementById("pikachu__image").src;
const squirtleImage = document.getElementById("squirtle__image").src;
const jogador1 = 'caaser';
const jogador2 = 'opponent';
//Fazer algo para atualizar os ataques confome os ataques dos jogadores

//Construtor da batalha
class battle {
  constructor(pokemon1, pokemon2){
    this.pokemon1 = pokemon1;
    this.pokemon2 = pokemon2;
  }

  willAttackMiss(accuracy){
    return Math.floor(Math.random() * 100) > accuracy;
  }

  checkAttack (pokemon, attack) {
    if(pokemon.type === 'water' && attack.type === 'electric') {
      turnText.innerText = 'Attack super effective';
      return 1.5*attack.power;
    }
    return attack.power;
  }

  gameOver(jogador){
      // Wait 1000 (Health loss animation)
    setTimeout(() => {
      // Update HTML text with the winner
      turnText.innerText = jogador + ' is the winner!';
      // Open alert with the winner
      alert(winner + ' is the winner! Close this alert to play again');
      // Reload the game
      this.updateHp(this.pokemon1.totalHp, this.pokemon1);
      this.updateHp(this.pokemon2.totalHp, this.pokemon2);

      //updateWinnerExp(winner);
      //roundCount = 0;
      //pokemon.squirtle.status = 'normal';
    }, 1000);
  }

  updateHp(newHP, pokemon) {
    //Prevents Hp to go lower than 0
    pokemon.hp = Math.max(newHP, 0);

    if(pokemon.hp === 0){
      this.gameOver(pokemon.jogador);
      if(pokemon.jogador === jogador1){
        squirtleImage = './assets/squirtleWin.gif';
        pikachuImage = './assets/hurtPikachu.png';
      } else {
        squirtleImage = './assets/squirtlePissed.gif';
        pikachuImage = './assets/pikachuWin.png';
      }
    }

    const barWidth = (pokemon.hp / pokemon.totalHp) * 100;
    jogador.xpBar.style.width = barWidth + '%';
  }


  damageTook(pokemon, ataque) {
    //Set damage animation
    if(pokemon.jogador === jogador1){
      squirtleImage = "assets/squirtleAtac.gif";
      setTimeout( () => {
        pikachuImage= "assets/hurtPikachu.png";
        this.updateHp(pokemon.hp - this.checkAttack(pokemon, ataque), pokemon);
      }, 1200);
      
      setTimeout( () => {
        squirtleImage = "assets/squirtle.gif";
        pikachuImage = "assets/pikachu.gif";
      }, 2400);
    } else {
      pikachuImage = "assets/pikachuAtac.gif";
      setTimeout( () => {
        squirtleImage = "assets/hurtSquirtle.png";
       this. updateHp(pokemon.hp - this.checkAttack(pokemon, ataque), pokemon);
      }, 1100)
      setTimeout( () => {
        squirtleImage = "assets/squirtle.gif";
        pikachuImage = "assets/pikachu.gif";
      }, 2100);
    }
  }

  playerAttack(ataque){
    //0 if misses
    if(this.willAttackMiss(ataque.accuracy)) return false;

    //1 update health and return true
    
  }
  
  turn(ataqueEscolhido) {
    console.log('turn ativada com: '+ ataqueEscolhido.name);
    //Don't start another turn till the current one is not finished
    if(isTurnHappening){
      return;
    }
    isTurnHappening = true;
    const didPlayerHit = this.playerAttack(ataqueEscolhido);


  }

  chooseAttack (attack) {
    console.log('choose attack ativada: ' + attack);
    const playerAttack = this.pokemon1.ataques;
    switch (attack) {
      case 'ataque1':
        this.turn(playerAttack.ataque1);
        break;
      case 'ataque2':
        this.turn(playerAttack.ataque2);
        break
      case 'aataque3':
        this.turn(playerAttack.ataque3);
        break;
      case 'ataque4':
        this.turn(playerAttack.ataque4);
        break;
      default:
        break;
    }
  }
  
}

class jogador {
  constructor(jogador, name, hp, type, ataques, healthBar, xpBar){
    this.jogador = jogador;
    this.name = name;
    this.hp = hp;
    this.totalHp = hp;
    this.type = type;
    this.status = 'normal';
    this.nivel = 1;
    this.exp = 0;
    this.expBar = 100;
    this.ataques = ataques;
    this.healthBar = healthBar;
    this.xpBar = xpBar;
  }
}

class ataques {
  constructor(ataque1, ataque2, ataque3, ataque4){
    this.ataque1 = ataque1;
    this.ataque2 = ataque2;
    this.ataque3 = ataque3;
    this.ataque4 = ataque4;
  }
}

class ataque {
  constructor(power, accuracy, name, type, special){
    this.power = power;
    this.accuracy = accuracy;
    this.name = name;
    this.type = type;
    this.special = special || false ;
  }
}
const thunderShock = new ataque(40, 100, 'Thunder Shock', 'electric', 'paralyze');
const thunder = new ataque(110, 70, 'Thunder', 'electric');
const quickAttack = new ataque(40, 100, 'Quick Attack', 'normal');
const submission = new ataque(80, 80, 'Submission', 'fighting');
const ataquesPikachu = new ataques (thunderShock, quickAttack, thunder, submission);
const pikachu = new jogador('caaser', 'pikachu', 274, 'electric', ataquesPikachu, playerHpElement, playerExpElement);

const tackle = new ataque(40,100, 'Tackle', 'normal');
const bubble = new ataque(40, 100, 'Bubble', 'water');
const waterGun = new ataque(40, 100, 'Water Gun', 'water');
const hydroPump = new ataque(110, 80, 'Hydro Pump','water');
const ataquesSquirtle = new ataques (tackle, bubble, waterGun, hydroPump);
const squirtle = new jogador ('opponent', 'squirtle', 292, 'water', ataquesSquirtle, opponentHpElement, opponentExpElement);

const batalha = new battle(pikachu, squirtle);




document.getElementById("opponent-name").innerHTML = pokemon.squirtle.name;
document.getElementById("opponent-level").innerHTML = "Level: " + pokemon.squirtle.nivel;
document.getElementById("player-name").innerHTML = pokemon.pikachu.name;
document.getElementById("player-level").innerHTML = "Level: " + pokemon.pikachu.nivel;

