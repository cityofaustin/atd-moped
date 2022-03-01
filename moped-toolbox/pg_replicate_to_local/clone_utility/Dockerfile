#FROM frankinaustin/postgis:13-3.2
FROM postgis/postgis:13-3.2

RUN apt-get update

# Helpful tools for if you use the image in a more persistant way
RUN apt-get install -y magic-wormhole vim aptitude

WORKDIR /root
#CMD tail -f /dev/null
CMD /root/scripts/pull_down__db.sh
