
se2420 logout
read -p "Press any key to resume ..."
se2420 login --username ageanmotorway --passw 12345
read -p "Press any key to resume ..."
se2420 healthcheck
read -p "Press any key to resume ..."
se2420 resetpasses
read -p "Press any key to resume ..."
se2420 healthcheck
read -p "Press any key to resume ..."
se2420 resetstations
read -p "Press any key to resume ..."
se2420 healthcheck
read -p "Press any key to resume ..."
se2420 admin --addpasses --source passes20.csv
read -p "Press any key to resume ..."
se2420 healthcheck
read -p "Press any key to resume ..."
se2420 tollstationpasses --station AM08 --from 20220710 --to 20220724 --format json
read -p "Press any key to resume ..."
se2420 tollstationpasses --station NAO04 --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 tollstationpasses --station NO01 --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 tollstationpasses --station OO03 --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 tollstationpasses --station XXX --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 tollstationpasses --station OO03 --from 20220710 --to 20220724 --format YYY
read -p "Press any key to resume ..."
se2420 errorparam --station OO03 --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 tollstationpasses --station AM08 --from 20220711 --to 20220722 --format json
read -p "Press any key to resume ..."
se2420 tollstationpasses --station NAO04 --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 tollstationpasses --station NO01 --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 tollstationpasses --station OO03 --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 tollstationpasses --station XXX --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 tollstationpasses --station OO03 --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 passanalysis --stationop AM --tagop NAO --from 20220710 --to 20220724 --format json
read -p "Press any key to resume ..."
se2420 passanalysis --stationop NAO --tagop AM --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 passanalysis --stationop NO --tagop OO --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 passanalysis --stationop OO --tagop KO --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 passanalysis --stationop XXX --tagop KO --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 passanalysis --stationop AM --tagop NAO --from 20220711 --to 20220722 --format json
read -p "Press any key to resume ..."
se2420 passanalysis --stationop NAO --tagop AM --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 passanalysis --stationop NO --tagop OO --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 passanalysis --stationop OO --tagop KO --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 passanalysis --stationop XXX --tagop KO --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 passescost --stationop AM --tagop NAO --from 20220710 --to 20220724 --format json
read -p "Press any key to resume ..."
se2420 passescost --stationop NAO --tagop AM --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 passescost --stationop NO --tagop OO --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 passescost --stationop OO --tagop KO --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 passescost --stationop XXX --tagop KO --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 passescost --stationop AM --tagop NAO --from 20220711 --to 20220722 --format json
read -p "Press any key to resume ..."
se2420 passescost --stationop NAO --tagop AM --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 passescost --stationop NO --tagop OO --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 passescost --stationop OO --tagop KO --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 passescost --stationop XXX --tagop KO --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 chargesby --opid NAO --from 20220710 --to 20220724 --format json
read -p "Press any key to resume ..."
se2420 chargesby --opid GE --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 chargesby --opid OO --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 chargesby --opid KO --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 chargesby --opid NO --from 20220710 --to 20220724 --format csv
read -p "Press any key to resume ..."
se2420 chargesby --opid NAO --from 20220711 --to 20220722 --format json
read -p "Press any key to resume ..."
se2420 chargesby --opid GE --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 chargesby --opid OO --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 chargesby --opid KO --from 20220711 --to 20220722 --format csv
read -p "Press any key to resume ..."
se2420 chargesby --opid NO --from 20220711 --to 20220722 --format csv