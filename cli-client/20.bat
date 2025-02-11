@echo off

call se2420 logout
pause
call se2420 login --username admin1 --passw securepass123
pause
call se2420 healthcheck
pause
call se2420 resetpasses
pause
call se2420 healthcheck
pause
call se2420 resetstations
pause
call se2420 healthcheck
pause
call se2420 admin --addpasses --source passes20.csv
pause
call se2420 healthcheck
pause
call se2420 tollstationpasses --station AM08 --from 20220710 --to 20220724 --format json
pause
call se2420 tollstationpasses --station NAO04 --from 20220710 --to 20220724 --format csv
pause
call se2420 tollstationpasses --station NO01 --from 20220710 --to 20220724 --format csv
pause
call se2420 tollstationpasses --station OO03 --from 20220710 --to 20220724 --format csv
pause
call se2420 tollstationpasses --station XXX --from 20220710 --to 20220724 --format csv
pause
call se2420 tollstationpasses --station OO03 --from 20220710 --to 20220724 --format YYY
pause
call se2420 errorparam --station OO03 --from 20220710 --to 20220724 --format csv
pause
call se2420 tollstationpasses --station AM08 --from 20220711 --to 20220722 --format json
pause
call se2420 tollstationpasses --station NAO04 --from 20220711 --to 20220722 --format csv
pause
call se2420 tollstationpasses --station NO01 --from 20220711 --to 20220722 --format csv
pause
call se2420 tollstationpasses --station OO03 --from 20220711 --to 20220722 --format csv
pause
call se2420 tollstationpasses --station XXX --from 20220711 --to 20220722 --format csv
pause
call se2420 tollstationpasses --station OO03 --from 20220711 --to 20220722 --format YYY
pause
call se2420 passanalysis --stationop AM --tagop NAO --from 20220710 --to 20220724 --format json
pause
call se2420 passanalysis --stationop NAO --tagop AM --from 20220710 --to 20220724 --format csv
pause
call se2420 passanalysis --stationop NO --tagop OO --from 20220710 --to 20220724 --format csv
pause
call se2420 passanalysis --stationop OO --tagop KO --from 20220710 --to 20220724 --format csv
pause
call se2420 passanalysis --stationop XXX --tagop KO --from 20220710 --to 20220724 --format csv
pause
call se2420 passanalysis --stationop AM --tagop NAO --from 20220711 --to 20220722 --format json
pause
call se2420 passanalysis --stationop NAO --tagop AM --from 20220711 --to 20220722 --format csv
pause
call se2420 passanalysis --stationop NO --tagop OO --from 20220711 --to 20220722 --format csv
pause
call se2420 passanalysis --stationop OO --tagop KO --from 20220711 --to 20220722 --format csv
pause
call se2420 passanalysis --stationop XXX --tagop KO --from 20220711 --to 20220722 --format csv
pause
call se2420 passescost --stationop AM --tagop NAO --from 20220710 --to 20220724 --format json
pause
call se2420 passescost --stationop NAO --tagop AM --from 20220710 --to 20220724 --format csv
pause
call se2420 passescost --stationop NO --tagop OO --from 20220710 --to 20220724 --format csv
pause
call se2420 passescost --stationop OO --tagop KO --from 20220710 --to 20220724 --format csv
pause
call se2420 passescost --stationop XXX --tagop KO --from 20220710 --to 20220724 --format csv
pause
call se2420 passescost --stationop AM --tagop NAO --from 20220711 --to 20220722 --format json
pause
call se2420 passescost --stationop NAO --tagop AM --from 20220711 --to 20220722 --format csv
pause
call se2420 passescost --stationop NO --tagop OO --from 20220711 --to 20220722 --format csv
pause
call se2420 passescost --stationop OO --tagop KO --from 20220711 --to 20220722 --format csv
pause
call se2420 passescost --stationop XXX --tagop KO --from 20220711 --to 20220722 --format csv
pause
call se2420 chargesby --opid NAO --from 20220710 --to 20220724 --format json
pause
call se2420 chargesby --opid GE --from 20220710 --to 20220724 --format csv
pause
call se2420 chargesby --opid OO --from 20220710 --to 20220724 --format csv
pause
call se2420 chargesby --opid KO --from 20220710 --to 20220724 --format csv
pause
call se2420 chargesby --opid NO --from 20220710 --to 20220724 --format csv
pause
call se2420 chargesby --opid NAO --from 20220711 --to 20220722 --format json
pause
call se2420 chargesby --opid GE --from 20220711 --to 20220722 --format csv
pause
call se2420 chargesby --opid OO --from 20220711 --to 20220722 --format csv
pause
call se2420 chargesby --opid KO --from 20220711 --to 20220722 --format csv
pause
call se2420 chargesby --opid NO --from 20220711 --to 20220722 --format csv

