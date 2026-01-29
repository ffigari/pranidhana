# Praṇidhāna – n.

A vow held deep within, a steadfast intention to awaken fully—not for oneself
alone, but to ease the suffering of all beings.

```
ssh root@<do-ip> "docker inspect pg --format='{{range \$k, \$v := .NetworkSettings.Networks}}{{\$k}}{{end}}'"

ssh root@<do-ip> "cd pranidhana/bin-paste && docker build -t bin-paste . && docker stop bin-paste && docker rm bin-paste && docker run -d --name bin-paste -p
   3004:3000 -e PGUSER=postgres -e PGHOST=pg -e PGDATABASE=clases -e PGPASSWORD=<pg-password> -e PGPORT=5432 bin-paste && docker network connect
   paste-bin-net bin-paste"
```
