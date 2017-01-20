`timescale 1ns / 1ps


module multiplier_tb;

	// Inputs
	
	reg clk;
	reg enable;
	reg [79:0] in_bits;//79
	// Outputs
	wire [15:0] out_text;//34
	reg valid;
	//parameter CYCLE = 1.0;
	
	// Instantiate the Unit Under Test (UUT)
	DecodeMorse uut (
		.clk(clk),
		.enable(enable),
		.in_bits(in_bits),
		.out_text(out_text),
		.valid(valid)
	);
	


	initial begin
		// Initialize Inputs
		valid = 0;
		in_bits = 80'b1110111000111011101110001011101000101010001000;
		enable =0;
		#50;
		enable = 1'b1;
		#800;
		enable =0;
		#50;
		

	end
	
	
	
	initial begin
		clk = 0;
	end
	always #5 begin 
		clk = ~clk ;
	end
	
endmodule

