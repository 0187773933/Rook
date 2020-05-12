<?php

function deal($game)
{
	print_r($game);
	$deck = array();
	$suit = array(
		Suit::Black,
		Suit::Yellow,
		Suit::Red,
		Suit::Green,
	);

	foreach($suit as $color)
	{
		$deck[] = new Card($color, 2, 0);
		$deck[] = new Card($color, 3, 0);
		$deck[] = new Card($color, 4, 0);
		$deck[] = new Card($color, 5, 5);
		$deck[] = new Card($color, 6, 0);
		$deck[] = new Card($color, 7, 0);
		$deck[] = new Card($color, 8, 0);
		$deck[] = new Card($color, 9, 0);
		$deck[] = new Card($color, 10, 10);
		$deck[] = new Card($color, 11, 0);
		$deck[] = new Card($color, 12, 0);
		$deck[] = new Card($color, 13, 0);
		$deck[] = new Card($color, 14, 10);
		$deck[] = new Card($color, 1, 15);
	}

	$deck[] = new Card(Suit::Rook, $game->Rules->RookValue, 20);
	//print_r($deck);
	shuffle($deck);
	print_r("Shuffled Deck = ");
	print_r($deck);
	$round = end($game->Rounds);
	$round->Deck = $deck;

	$game->Team1->Player1->Hand = array_slice($deck, 0, 10);
	$game->Team1->Player2->Hand = array_slice($deck, 10, 10);
	$game->Team2->Player1->Hand = array_slice($deck, 20, 10);
	$game->Team2->Player2->Hand = array_slice($deck, 30, 10);
        print_r("Team2->Player2's Hand =");
        print_r($game->Team2->Player2->Hand);

	$round = end($game->Rounds);
	//$round->Kitty = array_slice($deck, 40, 44);
	$round->Kitty = array_slice($deck, 40, 5);

}



?>