docker build -t rpearce63/multi-client:latest -t rpearce63/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t rpearce63/multi-server:latest -t rpearce63/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t rpearce63/multi-worker:latest -t rpearce63/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push rpearce63/multi-client:latest
docker push rpearce63/multi-server:latest
docker push rpearce63/multi-worker:latest

docker push rpearce63/multi-client:$SHA
docker push rpearce63/multi-server:$SHA
docker push rpearce63/multi-worker:$SHA

kubectl apply -f k8s

kubectl set image deployments/server-deployment server=rpearce63/multi-server:$SHA
kubectl set image deployments/client-deployment client=rpearce63/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=rpearce63/multi-worker:$SHA
