#!/bin/bash
# top 25 stop pairs by num_rows
declare -a arr=("1444_to_1445" "1478_to_1479" "619_to_675" "618_to_619" "616_to_617" "617_to_618" "614_to_615" "615_to_616" "516_to_4384" "7659_to_523" "522_to_7659" "519_to_521" "521_to_522" "4384_to_519" "51_to_52" "515_to_516" "7453_to_1478" "1479_to_315" "49_to_51" "1476_to_7453" "1020_to_1076" "1019_to_1020" "1018_to_1019" "1016_to_1017" "1017_to_1018")

# now loop through the above array
for i in "${arr[@]}"
do
	echo "$i"
	python -u -m models.run_model linear-regression learning-curve "$i"
done
