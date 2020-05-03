

let isTurnHappening = false;
let roundCount = 0;
let battlePause = false;

//Definição de variaveis do index
const turnText = document.getElementById('text');
const opponentName = document.getElementById("opponent-name");
const opponentLevel = document.getElementById("opponent-level");
const playerName = document.getElementById("player-name");
const playerLevel = document.getElementById("player-level");
const playerHpElement = document.getElementById("player-health");
const opponentHpElement = document.getElementById('opponent-health');
const playerExpElement = document.getElementById('player-exp');
const opponentExpElement = document.getElementById('opponent-exp');
const pikachuImage = document.getElementById("pikachu__image");
const squirtleImage = document.getElementById("squirtle__image");
const ataque1 = document.getElementById('ataque1');
const ataque2 = document.getElementById('ataque2');
const ataque3 = document.getElementById('ataque3');
const ataque4 = document.getElementById('ataque4');
const jogador1 = 'caaser';
const jogador2 = 'opponent';
//Fazer algo para atualizar os ataques confome os ataques dos jogadores

//Construtor da batalha
class battle {
  constructor(pokemon1, pokemon2){
    this.pokemon1 = pokemon1;
    this.pokemon2 = pokemon2;
  }

  resetBattle(){
    this.pokemon1.status = 'normal';
    this.pokemon2.status = 'normal';
    this.pokemon2.updateHp(this.pokemon2.totalHp);
    this.pokemon1.updateHp(this.pokemon1.totalHp);
    roundCount = 0;
    isTurnHappening = false;
    battlePause = true;
  }


  updateBattle(){
    opponentName.innerHTML = this.pokemon2.name;
    playerName.innerHTML = this.pokemon1.name;
    opponentLevel.innerHTML = "Level: " + this.pokemon2.nivel;
    playerLevel.innerHTML ="Level: "+  this.pokemon1.nivel;
    this.pokemon1.writeAtaques();
    this.pokemon1.updateHp(this.pokemon1.totalHp);
    this.pokemon2.updateHp(this.pokemon2.totalHp);
  }

  gameOver(pokemon){
      // Wait 1000 (Health loss animation)
    setTimeout(() => {
      // Update HTML text with the winner
      battlePause = true;
      let winner;
      pokemon.jogador === 'caaser' ? winner = this.pokemon2 : winner = this.pokemon1;
      turnText.innerText = winner.name + ' is the winner!';
      // Open alert with the winner
      alert(winner.name + ' is the winner! Close this alert to another round');
      // Reload the game
      const exp = 50*(pokemon.nivel);
      winner.updateExp(exp)
      this.updateBattle();
      this.resetBattle();

    }, 1000);
  }

  deathAnimation(pokemon){
    if(pokemon.jogador === jogador1){
      squirtleImage.src = './assets/squirtleWin.gif';
      pikachuImage.src = './assets/hurtPikachu.png';
    } else {
      squirtleImage.src = './assets/squirtlePissed.gif';
      pikachuImage.src = './assets/pikachuWin.png';
    }
  }

  damageTook(pokemon, ataque) {
    //Set damage animation
    if(pokemon.jogador === jogador2){
      pikachuImage.src = "assets/pikachuAtac.gif";
      setTimeout( () => {
        squirtleImage.src = "assets/hurtSquirtle.png";
        pokemon.updateHp(pokemon.hp - this.pokemon1.checkAttack(pokemon.type, ataque));
      }, 1100)
      setTimeout( () => {
        squirtleImage.src = "assets/squirtle.gif";
        pikachuImage.src = "assets/pikachu.gif";
      }, 2100);
    } else {
      squirtleImage.src = "assets/squirtleAtac.gif";
      setTimeout( () => {
        pikachuImage.src = "assets/hurtPikachu.png";
        pokemon.updateHp(pokemon.hp - this.pokemon2.checkAttack(pokemon.type, ataque));
      }, 1200);
      
      setTimeout( () => {
        squirtleImage.src = "assets/squirtle.gif";
        pikachuImage.src = "assets/pikachu.gif";
      }, 2400);
    }
  }

  playerAttack(ataque){
    //0 if misses
    if(ataque.willAttackMiss()) return false;

    //1 update health and return true
    this.damageTook(this.pokemon2, ataque);
    if(ataque.special === 'paralyze') {
      if ( Math.floor(Math.random() * 100) > (ataque.accuracy/2) ) {
        roundCount = 0;
        this.pokemon2.status = 'paralyzed';
      
      }
    }
    return true;
  }

  opponentAttack(ataque){
    //0 if misses
    if(ataque.willAttackMiss()) return false;

    //1 update health and return true
    this.damageTook(this.pokemon1 , ataque);
    return true;
  }

  chooseOpponentAttack() {
    const possibleAttacks = Object.values(this.pokemon2.ataques);

    return possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
  }
  
  turn(ataqueEscolhido) {
    console.log('turn ativada com: '+ ataqueEscolhido.name);
    //Don't start another turn till the current one is not finished
    if(isTurnHappening){
      return;
    }
    isTurnHappening = true;
    battlePause = false;
    const didPlayerHit = this.playerAttack(ataqueEscolhido);
    
    turnText.innerText = jogador1 + ' used ' + ataqueEscolhido.name;

    if(!didPlayerHit) {
      turnText.innerText += ', but missed!';
    }
    // Wait 3400ms to execute opponent attack (Player attack animation time)
    setTimeout(() => {
      if(battlePause) return;
      if( this.pokemon2.status === 'normal') {
        // Randomly chooses opponents attack
        const opponentChosenAttack = this.chooseOpponentAttack();

        const didOpponentHit = this.opponentAttack(opponentChosenAttack);

        // Update HTML text with the used attack
        turnText.innerText = jogador2 + ' used ' + opponentChosenAttack.name;

        // Update HTML text in case the attack misses
        if (!didOpponentHit) {
          turnText.innerText += ', but missed!';
        }

    } else {
        turnText.innerText =  jogador2 + ' is ' + this.pokemon2.status;
        roundCount += 1;
        if (roundCount === 2) {
          roundCount = 0;
          turnText.innerText = jogador2 + " isn't " + this.pokemon2.status + " anymore";
          this.pokemon2.status = 'normal';
        }
    }
     // Wait 2000ms to end the turn (Opponent attack animation time)
     setTimeout(() => {
      // Update HTML text for the next turn
      turnText.innerText = 'Please choose one attack';
      isTurnHappening = false;
    }, 2000);
  }, 3400);
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
      case 'ataque3':
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
    this.aprenderAtaque = false;
    this.listaAtaques = [];
  }

  addAtaque(ataque, nivel){
    //Adiciona ataques que podem ser aprendidos para determinados niveis
    const itemAtaque = {
      ataque: ataque,
      nivel: nivel,
    };
    this.listaAtaques.push(itemAtaque);
  }

  escolheAtaque(id) {
    switch (id) {
      case 'ataque1':
        this.ataques.ataque1 = this.learnAtaque();
        break;
      case 'ataque2':
        this.ataques.ataque2 = this.learnAtaque();
        break
      case 'ataque3':
        this.ataques.ataque3 = this.learnAtaque();
        break;
      case 'ataque4':
        this.ataques.ataque4 = this.learnAtaque();
        break;
      default:
        break;
    }
    this.writeAtaques();
    this.updateAtaques();
    turnText.innerText = this.name + ' aprendeu um novo ataque!';
    battlePause = false;
    this.aprenderAtaque = false;
    setTimeout(() => {
      turnText.innerText = 'Por favor escolha um ataque para iniciar a batalha';
    }, 1500);
  }

  checkListaAtaque(){
    this.listaAtaques.forEach(itemAtaque => {
      if(itemAtaque.nivel === this.nivel){
        return true;
      }
    });
    return false;
  }

  learnAtaque(){
    let objAtaque;
    this.listaAtaques.forEach(itemAtaque => {
      if(itemAtaque.nivel === this.nivel){
        objAtaque = itemAtaque.ataque;
        // break;
      }
    });
    return objAtaque;

  }

  checkAttack(opponentType, attack){
    let damage = attack.power * ((100 + this.nivel)/ 100);
    if(opponentType === 'water' && attack.type === 'electric'){
      turnText.innerText = 'Attack super effective';
      return 1.5*damage;
    }
    return damage;
  }

  writeAtaques(){
    ataque1.innerHTML = this.ataques.ataque1.name.toUpperCase();
    ataque2.innerHTML = this.ataques.ataque2.name.toUpperCase(); 
    ataque3.innerHTML = this.ataques.ataque3.name.toUpperCase();
    ataque4.innerHTML = this.ataques.ataque4.name.toUpperCase();
  }

  updateHp(newHp){
    this.hp = Math.max(newHp, 0);
    if(this.hp === 0){
      batalha.gameOver(this);
      batalha.deathAnimation(this);
    }

    const barWidth = (this.hp/this.totalHp) * 100;
    this.healthBar.style.width = barWidth + '%';
  }

  updateAtaques(){
    this.ataques.ataque1.power *= (100+this.nivel)/100;
    this.ataques.ataque2.power *= (100+this.nivel)/100;
    this.ataques.ataque3.power *= (100+this.nivel)/100;
    this.ataques.ataque4.power *= (100+this.nivel)/100;
  }

  updateLevel(){
    this.totalHp *= 1.05;
    this.hp = this.totalHp;
    this.nivel += 1;
    this.expBar *= 1.5;
    if(this.checkListaAtaque) {
      this.aprenderAtaque = true;
      turnText.innerText = this.name + ' quer aprender um ataque novo. Clique em um dos ataques para substituí-lo pelo novo';
    } else {
      this.updateAtaques();
      this.writeAtaques();
    }

    
    //Checar se existem novos ataques e aprende-los e despausar.
  }

  updateExp(qtdExp){
      if(this.exp + qtdExp >= this.expBar) {
        this.exp = 0;
        turnText.innerText = this.name + ' evoluiu!';
        battlePause = true;
        this.updateLevel();
      } else this.exp += qtdExp;

      const barWidth = (this.exp/ this.expBar) * 100;
      this.xpBar.style.width = barWidth + '%';
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

  willAttackMiss(){
    return Math.floor(Math.random() * 100) > this.accuracy;
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

const ironTail = new ataque(60, 90, 'Iron Tail', 'iron');
pikachu.addAtaque(ironTail, 2);


batalha.updateBattle();
// Set buttons click interaction

const pikachuAttack = id => {
  if(pikachu.aprenderAtaque){
    pikachu.aprenderAtaque = false;
    pikachu.escolheAtaque(id);
  } else{
    batalha.chooseAttack(id);
  } 

}

